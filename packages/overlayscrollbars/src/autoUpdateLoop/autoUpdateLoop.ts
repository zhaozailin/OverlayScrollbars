import { rAF, cAF, isEmptyArray, indexOf, createCache, runEach, push } from 'support';
import { getEnvironment } from 'environment';

export interface AutoUpdateLoop {
  _add(fn: (delta: number) => any): () => void;
  _interval(newInterval: number): () => void;
  _interval(): number;
}

const defaultLoopInterval = 33;
let autoUpdateLoopInstance: AutoUpdateLoop;

const createAutoUpdateLoop = (): AutoUpdateLoop => {
  let loopIsRunning = false;
  let loopInterval = defaultLoopInterval;
  let loopId: number | undefined;
  const intervals: number[] = [];
  const loopFunctions: Array<(...args: any) => any> = [];
  const updateLoopInterval = () => {
    loopInterval = isEmptyArray(intervals) ? defaultLoopInterval : Math.min.apply(null, intervals);
  };
  const updateTimeCache = createCache<number, number>((ctx) => ctx || performance.now(), {
    _initialValue: performance.now(),
    _equal: (currTime, newTime) => {
      const delta = newTime! - currTime!;
      return delta < loopInterval;
    },
  });
  const loop = (newTime?: number) => {
    /* istanbul ignore next */
    if (!isEmptyArray(loopFunctions) && loopIsRunning) {
      loopId = rAF!(loop);
      const { _changed, _value, _previous } = updateTimeCache(0, newTime);
      if (_changed) {
        runEach(loopFunctions, _value! - _previous!);
      }
    }
  };
  function interval(): number;
  function interval(newInterval: number): () => void;
  function interval(newInterval?: number): number | (() => void) {
    if (newInterval) {
      push(intervals, newInterval);
      updateLoopInterval();

      return () => {
        intervals.splice(indexOf(intervals, newInterval), 1);
        updateLoopInterval();
      };
    }
    return loopInterval;
  }

  return {
    _add: (fn) => {
      push(loopFunctions, fn);

      if (!loopIsRunning && !isEmptyArray(loopFunctions)) {
        getEnvironment()._autoUpdateLoop = loopIsRunning = true;

        updateTimeCache(true);
        loop();
      }

      return () => {
        loopFunctions.splice(indexOf(loopFunctions, fn), 1);

        if (isEmptyArray(loopFunctions) && loopIsRunning) {
          getEnvironment()._autoUpdateLoop = loopIsRunning = false;

          cAF!(loopId!);
          loopId = undefined;
        }
      };
    },
    _interval: interval,
  };
};

export const getAutoUpdateLoop = (): AutoUpdateLoop => {
  if (!autoUpdateLoopInstance) {
    autoUpdateLoopInstance = createAutoUpdateLoop();
  }
  return autoUpdateLoopInstance;
};

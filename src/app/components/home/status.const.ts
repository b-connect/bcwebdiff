// export const STATUS_OK:number = 1;
// export const STATUS_READY = 2;
// export const STATUS_ERROR = -1;
// export const STATUS_WORKING = 4;

interface IState {
  STATUS_OK: number;
  STATUS_READY: number;
  STATUS_ERROR: number;
  STATUS_WORKING: number;
}

export const State: IState = {
  STATUS_OK: 1,
  STATUS_READY: 2,
  STATUS_ERROR: -1,
  STATUS_WORKING: 4,
}

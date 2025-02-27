import type {
  OrderSubmission,
  StopOrderSetup,
  StopOrdersSubmission,
} from '@vegaprotocol/wallet';
import type {
  OrderFormValues,
  StopOrderFormValues,
} from '../hooks/use-form-values';
import * as Schema from '@vegaprotocol/types';
import { removeDecimal, toNanoSeconds } from '@vegaprotocol/utils';
import { isPersistentOrder } from './time-in-force-persistance';

export const mapFormValuesToOrderSubmission = (
  order: OrderFormValues,
  marketId: string,
  decimalPlaces: number,
  positionDecimalPlaces: number
): OrderSubmission => ({
  marketId: marketId,
  type: order.type,
  side: order.side,
  timeInForce: order.timeInForce,
  price:
    order.type === Schema.OrderType.TYPE_LIMIT && order.price
      ? removeDecimal(order.price, decimalPlaces)
      : undefined,
  size: removeDecimal(order.size, positionDecimalPlaces),
  expiresAt:
    order.expiresAt &&
    order.timeInForce === Schema.OrderTimeInForce.TIME_IN_FORCE_GTT
      ? toNanoSeconds(order.expiresAt)
      : undefined,
  postOnly:
    order.type === Schema.OrderType.TYPE_MARKET ||
    [
      Schema.OrderTimeInForce.TIME_IN_FORCE_FOK,
      Schema.OrderTimeInForce.TIME_IN_FORCE_IOC,
    ].includes(order.timeInForce)
      ? false
      : order.postOnly,
  reduceOnly: ![
    Schema.OrderTimeInForce.TIME_IN_FORCE_FOK,
    Schema.OrderTimeInForce.TIME_IN_FORCE_IOC,
  ].includes(order.timeInForce)
    ? false
    : order.reduceOnly,
  icebergOpts:
    order.type === Schema.OrderType.TYPE_LIMIT &&
    isPersistentOrder(order.timeInForce) &&
    order.iceberg &&
    order.peakSize &&
    order.minimumVisibleSize
      ? {
          peakSize: removeDecimal(order.peakSize, positionDecimalPlaces),
          minimumVisibleSize: removeDecimal(
            order.minimumVisibleSize,
            positionDecimalPlaces
          ),
        }
      : undefined,
});

const setTrigger = (
  stopOrderSetup: StopOrderSetup,
  triggerType: StopOrderFormValues['triggerPrice'],
  triggerPrice: StopOrderFormValues['triggerPrice'],
  triggerTrailingPercentOffset: StopOrderFormValues['triggerTrailingPercentOffset'],
  decimalPlaces: number
) => {
  if (triggerType === 'price') {
    stopOrderSetup.price = removeDecimal(triggerPrice ?? '', decimalPlaces);
  } else if (triggerType === 'trailingPercentOffset') {
    stopOrderSetup.trailingPercentOffset = (
      Number(triggerTrailingPercentOffset) / 100
    ).toFixed(3);
  }
};

export const mapFormValuesToStopOrdersSubmission = (
  data: StopOrderFormValues,
  marketId: string,
  decimalPlaces: number,
  positionDecimalPlaces: number
): StopOrdersSubmission => {
  const submission: StopOrdersSubmission = {};
  const stopOrderSetup: StopOrderSetup = {
    orderSubmission: mapFormValuesToOrderSubmission(
      {
        type: data.type,
        side: data.side,
        size: data.size,
        timeInForce: data.timeInForce,
        price: data.price,
        reduceOnly: true,
      },
      marketId,
      decimalPlaces,
      positionDecimalPlaces
    ),
  };
  setTrigger(
    stopOrderSetup,
    data.triggerType,
    data.triggerPrice,
    data.triggerTrailingPercentOffset,
    decimalPlaces
  );
  let oppositeStopOrderSetup: StopOrderSetup | undefined = undefined;
  if (data.oco) {
    oppositeStopOrderSetup = {
      orderSubmission: mapFormValuesToOrderSubmission(
        {
          type: data.ocoType,
          side: data.side,
          size: data.ocoSize,
          timeInForce: data.ocoTimeInForce,
          price: data.ocoPrice,
          reduceOnly: true,
        },
        marketId,
        decimalPlaces,
        positionDecimalPlaces
      ),
    };
    setTrigger(
      oppositeStopOrderSetup,
      data.ocoTriggerType,
      data.ocoTriggerPrice,
      data.ocoTriggerTrailingPercentOffset,
      decimalPlaces
    );
  }

  if (data.expire) {
    const expiresAt = data.expiresAt && toNanoSeconds(data.expiresAt);
    stopOrderSetup.expiresAt = expiresAt;
    stopOrderSetup.expiryStrategy = data.expiryStrategy;
    if (oppositeStopOrderSetup) {
      oppositeStopOrderSetup.expiresAt = expiresAt;
      oppositeStopOrderSetup.expiryStrategy = data.expiryStrategy;
    }
  }

  if (
    data.triggerDirection ===
    Schema.StopOrderTriggerDirection.TRIGGER_DIRECTION_RISES_ABOVE
  ) {
    submission.risesAbove = stopOrderSetup;
    submission.fallsBelow = oppositeStopOrderSetup;
  }
  if (
    data.triggerDirection ===
    Schema.StopOrderTriggerDirection.TRIGGER_DIRECTION_FALLS_BELOW
  ) {
    submission.fallsBelow = stopOrderSetup;
    submission.risesAbove = oppositeStopOrderSetup;
  }

  return submission;
};

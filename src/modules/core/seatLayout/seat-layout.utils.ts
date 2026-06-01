import { BookableSeatTypes } from './seat-layout.types';
import {
  LayoutItemInjectedInput,
  SeatLayoutInjectedInput,
  SeatLayoutInput,
} from './seat-layout.validation';

export const injectTotalSeats = (layout: SeatLayoutInput): SeatLayoutInjectedInput => {
  const lowerDeck = layout.config.decks.lower;
  const upperDeck = layout.config.decks.upper;
  let totalSeats = 0;
  let bitIndex = 0;
  const injectedLowerDeck: LayoutItemInjectedInput[] = lowerDeck.map(
    (seat): LayoutItemInjectedInput => {
      const isBookable =
        seat.type === BookableSeatTypes.SEAT || seat.type === BookableSeatTypes.SLEEPER;
      if (isBookable) {
        totalSeats++;
      }
      return {
        ...seat,
        bitIndex: isBookable ? bitIndex++ : undefined,
      };
    },
  );

  const injectedUpperDeck: LayoutItemInjectedInput[] | undefined = upperDeck?.map(
    (seat): LayoutItemInjectedInput => {
      const isBookable =
        seat.type === BookableSeatTypes.SEAT || seat.type === BookableSeatTypes.SLEEPER;
      if (isBookable) {
        totalSeats++;
      }
      return {
        ...seat,
        bitIndex: isBookable ? bitIndex++ : undefined,
      };
    },
  );

  const injectedLayout: SeatLayoutInjectedInput = {
    layoutName: layout.layoutName,
    config: {
      ...layout.config,
      decks: {
        lower: injectedLowerDeck,
        upper: injectedUpperDeck,
      },
      totalSeats: totalSeats,
    },
  };
  return injectedLayout;
};

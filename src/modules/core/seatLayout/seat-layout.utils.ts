import { SeatLayoutInjectedInput, SeatLayoutInput } from './seat-layout.validation';

export const injectTotalSeats = (layout: SeatLayoutInput): SeatLayoutInjectedInput => {
  console.log(layout.config);
  const lowerDeck = layout.config.decks.lower;
  const upperDeck = layout.config.decks.upper;
  const allEntities = [...lowerDeck, ...(upperDeck || [])];
  const filteredSeats = allEntities.filter(
    (entity) => entity.type === 'seat' || entity.type === 'sleeper',
  );
  const injectedLayout: SeatLayoutInjectedInput = {
    layoutName: layout.layoutName,
    config: {
      ...layout.config,
      totalSeats: filteredSeats.length,
    },
  };
  return injectedLayout;
};

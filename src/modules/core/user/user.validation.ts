import z from 'zod';
import { BookableSeatTypes } from '../seatLayout/seat-layout.types';

const LayoutItemSchema = z.object({
  id: z.string({ message: 'A valid ID is required' }).min(1, 'A valid ID is required'),

  label: z.string({ message: 'A valid Label is required' }).min(1, 'A valid Label is required'),

  type: z.union(
    [z.enum(BookableSeatTypes), z.literal('DRIVER'), z.literal('CONDUCTOR'), z.literal('DOOR')],
    { message: 'A valid layout item type is required' },
  ),

  row: z
    .number({ message: 'Row must be a valid number' })
    .int('Row must be a valid integer')
    .nonnegative('Row cannot be negative'),

  col: z
    .number({ message: 'Column must be a valid number' })
    .int('Column must be a valid integer')
    .nonnegative('Column cannot be negative'),

  rowSpan: z
    .number({ message: 'Row span must be a valid number' })
    .int('Row span must be a valid integer')
    .positive('Row span must be greater than zero')
    .default(1),

  colSpan: z
    .number({ message: 'Column span must be a valid number' })
    .int('Column span must be a valid integer')
    .positive('Column span must be greater than zero')
    .default(1),
});

export const SeatLayoutSchema = z.object({
  layoutName: z
    .string({ message: 'A valid Layout Name is required' })
    .min(1, 'A valid Layout Name is required'),

  config: z.object({
    dimensions: z.object({
      columns: z
        .number({ message: 'Columns must be a valid number' })
        .int('Columns must be a valid integer')
        .positive('Columns must be greater than zero'),

      rows: z
        .number({ message: 'Rows must be a valid number' })
        .int('Rows must be a valid integer')
        .positive('Rows must be greater than zero'),

      noOfDecks: z
        .number({ message: 'Number of decks must be a valid number' })
        .int('Number of decks must be a valid integer')
        .positive('Number of decks must be greater than zero'),
    }),

    decks: z.object({
      lower: z.array(LayoutItemSchema),
      upper: z.array(LayoutItemSchema).optional(),
    }),
  }),
});

export const SeatLayoutSchemaInjected = SeatLayoutSchema.extend({
  config: SeatLayoutSchema.shape.config.extend({
    totalSeats: z
      .number({ message: 'Total seats must be a valid number' })
      .int('Total seats must be a valid integer'),
  }),
});

export type SeatLayoutInput = z.infer<typeof SeatLayoutSchema>;
export type SeatLayoutInjectedInput = z.infer<typeof SeatLayoutSchemaInjected>;

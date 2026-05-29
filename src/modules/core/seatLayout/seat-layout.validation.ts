import z from 'zod';
import { BookableSeatTypes } from './seat-layout.types';

const LayoutItemSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  label: z.string().min(1, 'Label is required'),

  type: z.union([
    z.enum(BookableSeatTypes),
    z.literal('DRIVER'),
    z.literal('CONDUCTOR'),
    z.literal('DOOR'),
  ]),

  row: z.number().int('Row must be an integer').nonnegative('Row cannot be negative'),
  col: z.number().int('Column must be an integer').nonnegative('Column cannot be negative'),

  rowSpan: z
    .number()
    .int('Row span must be an integer')
    .positive('Row span must be at least 1')
    .default(1),
  colSpan: z
    .number()
    .int('Column span must be an integer')
    .positive('Column span must be at least 1')
    .default(1),
});

export const SeatLayoutSchema = z.object({
  layoutName: z.string().min(1, 'Layout Name is Required'),
  config: z.object({
    dimensions: z.object({
      columns: z
        .number()
        .int('Columns must be an integer')
        .positive('Columns must be greater than 0'),
      rows: z.number().int('Rows must be an integer').positive('Rows must be greater than 0'),
      noOfDecks: z
        .number()
        .int('Number of decks must be an integer')
        .positive('Number of decks must be at least 1'),
    }),
    decks: z.object({
      lower: z.array(LayoutItemSchema),
      upper: z.array(LayoutItemSchema).optional(),
    }),
  }),
});

export const SeatLayoutSchemaInjected = SeatLayoutSchema.extend({
  config: SeatLayoutSchema.shape.config.extend({
    totalSeats: z.number().int('Total seats must be an integer'),
  }),
});

export type SeatLayoutInput = z.infer<typeof SeatLayoutSchema>;
export type SeatLayoutInjectedInput = z.infer<typeof SeatLayoutSchemaInjected>;

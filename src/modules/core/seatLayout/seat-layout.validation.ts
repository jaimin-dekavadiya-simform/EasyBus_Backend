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

  row: z.number().int().nonnegative(),
  col: z.number().int().nonnegative(),

  rowSpan: z.number().int().positive().default(1),
  colSpan: z.number().int().positive().default(1),
});

export const SeatLayoutSchema = z.object({
  layoutName: z.string().min(1, 'Layout Name is Required'),
  config: z.object({
    dimensions: z.object({
      columns: z.number().int().positive(),
      rows: z.number().int().positive(),
      noOfDecks: z.number().int().positive(),
    }),
    decks: z.object({
      lower: z.array(LayoutItemSchema),
      upper: z.array(LayoutItemSchema).optional(),
    }),
  }),
});

export const SeatLayoutSchemaInjected = SeatLayoutSchema.extend({
  config: SeatLayoutSchema.shape.config.extend({
    totalSeats: z.int(),
  }),
});

export type SeatLayoutInput = z.infer<typeof SeatLayoutSchema>;
export type SeatLayoutInjectedInput = z.infer<typeof SeatLayoutSchemaInjected>;

-- CreateEnum
CREATE TYPE "BusClasses" AS ENUM ('SEATER', 'SEMI_SLEEPER', 'SLEEPER', 'AC_SEATER', 'AC_SEMI_SLEEPER', 'AC_SLEEPER');

-- CreateTable
CREATE TABLE "buses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "org_id" UUID NOT NULL,
    "layout_id" UUID NOT NULL,
    "registration_number" TEXT NOT NULL,
    "bus_class" "BusClasses" NOT NULL,

    CONSTRAINT "buses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "buses" ADD CONSTRAINT "buses_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buses" ADD CONSTRAINT "buses_layout_id_fkey" FOREIGN KEY ("layout_id") REFERENCES "seat_layouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

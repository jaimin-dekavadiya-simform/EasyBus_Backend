-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_org_id_fkey";

-- DropForeignKey
ALTER TABLE "RouteStops" DROP CONSTRAINT "RouteStops_route_id_fkey";

-- DropForeignKey
ALTER TABLE "RouteStops" DROP CONSTRAINT "RouteStops_stop_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_org_id_fkey";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStops" ADD CONSTRAINT "RouteStops_stop_id_fkey" FOREIGN KEY ("stop_id") REFERENCES "stops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStops" ADD CONSTRAINT "RouteStops_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

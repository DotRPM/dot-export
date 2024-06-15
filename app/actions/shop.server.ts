import prisma from "~/db.server";
import { TAdminApi } from "~/shopify.server";
import { Session } from "@shopify/shopify-api";

export async function createShop(admin: TAdminApi, session: Session) {
  const { data: shopData } = await admin.rest.resources.Shop.all({ session });

  return prisma.shop.create({
    data: {
      shop: session.shop,
      email: shopData[0].email || "",
      owner: shopData[0].shop_owner || "",
      phone: shopData[0].phone || "",
      country: shopData[0].country_name || "",
    },
  });
}

export async function initShop(admin: TAdminApi, session: Session) {
  let shop = await prisma.shop.findUnique({ where: { shop: session.shop } });
  if (!shop) shop = await createShop(admin, session);
  return shop;
}

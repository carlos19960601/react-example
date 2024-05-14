import Link from "next/link";
import CartBadge from "./cart-badge";

export default function Cart() {
  return (
    <>
      <Link href="/checkout/cart" className="lg:hidden">
        <CartBadge />
      </Link>
      <div></div>
    </>
  );
}

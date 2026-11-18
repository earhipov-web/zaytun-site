import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { TransitionProvider } from "@/components/transition";
import { HomePage } from "@/pages/Home";
import { MastersPage } from "@/pages/Masters";
import { ServicesPage } from "@/pages/Services";
import { BookingPage, BookingMasterPage } from "@/pages/Booking";
import { CartPage, CheckoutPage } from "@/pages/Cart";
import { TLink } from "@/components/transition";

function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 pt-20 text-center">
      <h1 className="text-[44px] text-wood-dark">Страница не найдена</h1>
      <TLink to="/" className="mt-4 inline-block font-medium text-wood underline underline-offset-4">На главную</TLink>
    </div>
  );
}

export default function App() {
  return (
    <TransitionProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/masters" element={<MastersPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/booking/master" element={<BookingMasterPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </TransitionProvider>
  );
}

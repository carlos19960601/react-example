import { createI18n, I18nextProvider } from "@affine/i18n";
import { useMemo } from "react";

const App = ({ Component, pageProps }) => {
  const i18n = useMemo(() => createI18n(), []);

  return (
    <I18nextProvider i18n={i18n}>
      <Component {...pageProps} />
    </I18nextProvider>
  );
};

export default App;

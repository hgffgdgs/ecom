import {NextIntlClientProvider} from 'next-intl';
import {ReactNode} from 'react';
import {notFound} from 'next/navigation';

export const dynamic = 'force-static';

export const metadata = {
  title: 'ElectroPap',
  description: 'E-commerce électronique & papeterie'
};

export default async function LocaleLayout({children, params}: {children: ReactNode; params: {locale: string}}) {
  const {locale} = params;
  const locales = ['fr', 'en'];
  if (!locales.includes(locale)) notFound();

  const messages = (await import(`../../messages/${locale}.json`)).default;
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}


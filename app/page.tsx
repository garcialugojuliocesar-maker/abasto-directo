"use client";

import React, { useMemo, useState } from "react";

export default function AbastoDirectoLanding() {

  const whatsappNumber =
process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  const whatsappBaseMessage =
    "Hola, quiero realizar un pedido en Abasto Club.";

  // =========================
  // STATES UI
  // =========================

  const [showConfigurator, setShowConfigurator] =
    useState(false);

  // =========================
  // COBERTURA
  // =========================

  const coverageZones = [
    { zone: "Álvaro Obregón", start: 1000, end: 1990 },
    { zone: "Benito Juárez", start: 3000, end: 3940 },
    { zone: "Coyoacán", start: 4000, end: 4980 },
    { zone: "Cuajimalpa / Santa Fe", start: 5000, end: 5990 },
    { zone: "Cuauhtémoc Sur", start: 6000, end: 6990 },
    { zone: "Iztacalco", start: 8000, end: 8900 },
    { zone: "Iztapalapa Sur", start: 9000, end: 9990 },
    { zone: "Magdalena Contreras", start: 10000, end: 10920 },
    { zone: "Miguel Hidalgo Sur", start: 11000, end: 11850 },
    { zone: "Tlalpan", start: 14000, end: 14990 },
    { zone: "Venustiano Carranza", start: 15000, end: 15990 },
    { zone: "Xochimilco", start: 16000, end: 16990 },
  ];

  // =========================
  // PAQUETES
  // =========================

  const packages = [
    {
      id: "5",
      name: "5 KG",
      premiumLimit: 1,
      regularLimit: 2,
      complementaryLimit: 2,
    },
    {
      id: "10",
      name: "10 KG",
      premiumLimit: 2,
      regularLimit: 4,
      complementaryLimit: 4,
    },
    {
      id: "15",
      name: "15 KG",
      premiumLimit: 3,
      regularLimit: 6,
      complementaryLimit: 6,
    },
  ];

  // =========================
  // PRODUCTOS
  // =========================

  const products = {

    premium: [
      "Rib Eye",
      "New York",
      "Picaña",
      "Arrachera",
      "Filete de salmón",
    ],

    regular: [
      "Pechuga de pollo",
      "Carne molida",
      "Chuleta de cerdo",
      "Milanesa de res",
      "Jamón rebanado",
    ],

    complementary: [
      "Queso panela",
      "Queso Chihuahua",
      "Queso manchego",
      "Papas para freír",
      "Salchicha",
    ],
  };

  // =========================
  // STATES PEDIDO
  // =========================

  const [coverageCp, setCoverageCp] = useState("");

  // Validador verde: solo consulta cobertura.
  const [coverageChecked, setCoverageChecked] =
    useState(false);
  const [coverageHasCoverage, setCoverageHasCoverage] =
    useState(false);
  const [coverageZoneName, setCoverageZoneName] =
    useState("");

  // Validador naranja: pedido y WhatsApp.
  const [customerCp, setCustomerCp] = useState("");
  const [checked, setChecked] = useState(false);
  const [hasCoverage, setHasCoverage] = useState(false);
  const [zoneName, setZoneName] = useState("");

  const [selectedPackage, setSelectedPackage] =
    useState(packages[0]);

  const [quantities, setQuantities] =
    useState<Record<string, number>>({});

  const [customerName, setCustomerName] =
    useState("");

  const [customerWhatsapp, setCustomerWhatsapp] =
    useState("");

  const [customerColony, setCustomerColony] =
    useState("");

  // =========================
  // COBERTURA LOGICA
  // =========================

  const findCoverageZone = (cp: string) => {

    const cleanCP = cp.trim();

    if (!/^\d{4,5}$/.test(cleanCP)) {
      return null;
    }

    const cpNumber = Number(cleanCP);

    return coverageZones.find(
      (zone) =>
        cpNumber >= zone.start &&
        cpNumber <= zone.end
    );
  };

  // Validador verde: no afecta el pedido ni WhatsApp.
  const handleCoverageCheck = () => {

    const matchedZone = findCoverageZone(coverageCp);

    if (matchedZone) {

      setCoverageHasCoverage(true);
      setCoverageZoneName(matchedZone.zone);

    } else {

      setCoverageHasCoverage(false);
      setCoverageZoneName("");
    }

    setCoverageChecked(true);
  };

  // Validador naranja: controla el pedido y habilita WhatsApp.
  const handleCustomerCoverageCheck = () => {

    const matchedZone = findCoverageZone(customerCp);

    if (matchedZone) {

      setHasCoverage(true);
      setZoneName(matchedZone.zone);

    } else {

      setHasCoverage(false);
      setZoneName("");
    }

    setChecked(true);
  };

  // =========================
  // CALCULOS
  // =========================

  const getCategoryTotal = (
    category: keyof typeof products
  ) => {

    return products[category].reduce((acc, product) => {

      return acc + (quantities[product] || 0);

    }, 0);
  };

  const premiumTotal =
    getCategoryTotal("premium");

  const regularTotal =
    getCategoryTotal("regular");

  const complementaryTotal =
    getCategoryTotal("complementary");

  const totalKg =
    premiumTotal +
    regularTotal +
    complementaryTotal;

  // =========================
  // CONTROL PRODUCTOS
  // =========================

  const updateQuantity = (
    product: string,
    category: "premium" | "regular" | "complementary",
    operation: "add" | "remove"
  ) => {

    const limits = {
      premium: selectedPackage.premiumLimit,
      regular: selectedPackage.regularLimit,
      complementary:
        selectedPackage.complementaryLimit,
    };

    const currentCategoryTotal =
      getCategoryTotal(category);

    const currentProductQty =
      quantities[product] || 0;

    if (operation === "add") {

      if (
        currentCategoryTotal >=
        limits[category]
      ) {
        return;
      }

      setQuantities({
        ...quantities,
        [product]: currentProductQty + 1,
      });
    }

    if (operation === "remove") {

      if (currentProductQty <= 0) {
        return;
      }

      setQuantities({
        ...quantities,
        [product]: currentProductQty - 1,
      });
    }
  };

  // =========================
  // VALIDACION
  // =========================

  const packageCompleted =

    premiumTotal ===
      selectedPackage.premiumLimit &&

    regularTotal ===
      selectedPackage.regularLimit &&

    complementaryTotal ===
      selectedPackage.complementaryLimit;

  // =========================
  // RESUMEN
  // =========================

  const selectedProducts = useMemo(() => {

    return Object.entries(quantities)
      .filter(([_, qty]) => qty > 0);

  }, [quantities]);

  // =========================
  // WHATSAPP
  // =========================

  const whatsappOrderMessage =
    encodeURIComponent(`

${whatsappBaseMessage}

========================
DATOS DEL CLIENTE
========================

Nombre: ${customerName}
WhatsApp: ${customerWhatsapp}
Código Postal: ${customerCp}
Colonia: ${customerColony}

========================
PAQUETE
========================

Paquete:
${selectedPackage.name}

Premium: ${premiumTotal} kg
Regular: ${regularTotal} kg
Complementaria: ${complementaryTotal} kg

========================
PRODUCTOS
========================

${selectedProducts
  .map(([product, qty]) =>
    `• ${product}: ${qty} kg`
  )
  .join("\n")}

========================
TOTAL
========================

${totalKg} kg

`);

  const finalWhatsappUrl =
    `https://wa.me/${whatsappNumber}?text=${whatsappOrderMessage}`;

  return (

    <main className="min-h-screen overflow-x-hidden bg-[#F7F7F4] text-[#374151]">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[#E5E7EB]/70 bg-[#F7F7F4]/90 backdrop-blur-xl">

        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-7 lg:px-8 lg:py-6">

          <a href="#hero" className="flex items-center">

            <img
              src="/images/logo-abasto-navbar.png"
              alt="Abasto Club"
              className="h-28 w-auto object-contain sm:h-32 lg:h-36"
            />

          </a>

          <div className="hidden items-center gap-12 text-sm font-semibold text-[#374151] lg:flex">

            <a
              href="#como-funciona"
              className="transition hover:text-[#0B5D2A]"
            >
              Cómo funciona
            </a>

            <a
              href="#paquetes"
              className="transition hover:text-[#0B5D2A]"
            >
              Paquetes
            </a>

            <a
              href="#cobertura"
              className="transition hover:text-[#0B5D2A]"
            >
              Cobertura
            </a>

            <a
              href="#testimonios"
              className="transition hover:text-[#0B5D2A]"
            >
              Testimonios
            </a>

            <a
              href="#app-experience"
              className="transition hover:text-[#0B5D2A]"
            >
              App
            </a>

          </div>

        </nav>

      </header>

      {/* HERO */}
      <section
        id="hero"
        className="mx-auto grid max-w-7xl gap-10 px-5 py-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:px-8 lg:py-10"
      >

        <div className="flex flex-col justify-center">

          <span className="mb-5 w-fit rounded-full bg-[#73C23A]/12 px-5 py-2 text-sm font-bold uppercase tracking-wide text-[#0B5D2A]">
            Del productor directo a tu hogar
          </span>

          <h1 className="font-[Poppins] text-4xl font-extrabold leading-[0.95] text-[#0B5D2A] sm:text-5xl lg:text-6xl xl:text-7xl">

            Compra
            <br />
            directo.

            <span className="mt-2 block text-[#F97316]">
              Paga menos.
            </span>

          </h1>

          <p className="mt-8 max-w-xl text-xl leading-10 text-[#4B5563]">

            Productos frescos y de calidad,
            sin tantos intermediarios.
            Paquetes configurables por volumen
            y entrega organizada en CDMX.

          </p>

        </div>

        {/* HERO IMAGE */}
        <div className="relative overflow-hidden rounded-[42px] bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

          <picture>

            <source
              media="(max-width: 767px)"
              srcSet="/images/hero-abasto-mobile-light.png"
            />

            <source
              media="(max-width: 1023px)"
              srcSet="/images/hero-abasto-tablet-light.png"
            />

            <img
              src="/images/hero-abasto-desktop-light.png"
              alt="Hero Abasto Club"
              className="h-full w-full rounded-[36px] object-cover"
            />

          </picture>

        </div>

      </section>
      {/* COMPRA GRUPAL */}
      <section
        id="como-funciona"
        className="mx-auto max-w-7xl px-5 py-10 lg:px-8"
      >

        <div className="overflow-hidden rounded-[40px] bg-white p-2 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">

          <picture>

            <source
              media="(max-width: 767px)"
              srcSet="/images/compra-grupal-mobile.png"
            />

            <source
              media="(max-width: 1023px)"
              srcSet="/images/compra-grupal-tablet.png"
            />

            <img
              src="/images/compra-grupal-desktop.png"
              alt="Compra grupal"
              className="w-full rounded-[32px] object-cover"
            />

          </picture>

        </div>

      </section>

      {/* PAQUETES */}
      <section
        id="paquetes"
        className="mx-auto max-w-7xl px-5 py-10 lg:px-8"
      >

        <div className="overflow-hidden rounded-[40px] bg-white p-2 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">

          <picture>

            <source
              media="(max-width: 767px)"
              srcSet="/images/paquetes-abasto-mobile.png"
            />

            <source
              media="(max-width: 1023px)"
              srcSet="/images/paquetes-abasto-tablet.png"
            />

            <img
              src="/images/paquetes-abasto-desktop.png"
              alt="Paquetes"
              className="w-full rounded-[32px] object-cover"
            />

          </picture>

        </div>

      </section>

      {/* BOTON CONFIGURADOR */}
      <section className="mx-auto max-w-7xl px-5 py-2 lg:px-8">

        <div className="flex justify-center">

          <button
            onClick={() => setShowConfigurator(true)}
            className="rounded-2xl bg-[#FF6B00] px-10 py-5 text-lg font-extrabold text-white shadow-2xl transition hover:bg-[#EA5F00]"
          >
            Configura tu paquete
          </button>

        </div>

      </section>

      {/* CONFIGURADOR */}
      {showConfigurator && (

      <section
        id="paquetes-configurador"
        className="mx-auto max-w-7xl px-5 py-16 lg:px-8"
      >

        <div className="mb-14">

          <span className="mb-5 inline-flex rounded-full bg-[#73C23A]/12 px-5 py-2 text-sm font-bold uppercase tracking-wide text-[#0B5D2A]">
            Configura tu paquete
          </span>

          <h2 className="font-[Poppins] text-4xl font-extrabold leading-tight text-[#0B5D2A] md:text-6xl">
            Arma tu pedido ideal.
          </h2>

          <p className="mt-6 max-w-3xl text-xl leading-9 text-[#4B5563]">
            Selecciona tu paquete y configura
            los kilos permitidos por categoría.
          </p>

        </div>

        {/* TARJETAS PAQUETE */}
        <div className="grid gap-6 lg:grid-cols-3">

          {packages.map((pkg) => {

            const selected =
              selectedPackage.id === pkg.id;

            return (

              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg)}
                className={`rounded-[32px] border-2 p-8 text-left transition ${
                  selected
                    ? "border-[#0B7A33] bg-[#DCFCE7]"
                    : "border-transparent bg-white hover:border-[#0B7A33]"
                }`}
              >

                <p className="text-sm font-bold uppercase tracking-wide text-[#0B5D2A]">
                  Paquete
                </p>

                <h3 className="mt-3 text-6xl font-extrabold text-[#0B5D2A]">
                  {pkg.name}
                </h3>

                <div className="mt-8 space-y-3 text-lg text-[#374151]">

                  <p>
                    Premium:
                    {" "}
                    {pkg.premiumLimit}
                    {" "}
                    kg
                  </p>

                  <p>
                    Regular:
                    {" "}
                    {pkg.regularLimit}
                    {" "}
                    kg
                  </p>

                  <p>
                    Complementaria:
                    {" "}
                    {pkg.complementaryLimit}
                    {" "}
                    kg
                  </p>

                </div>

              </button>

            );
          })}

        </div>

        {/* PRODUCTOS */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">

          {/* PREMIUM */}
          <div className="rounded-[32px] bg-white p-8 shadow-lg">

            <div className="flex items-center justify-between">

              <h3 className="text-3xl font-extrabold text-[#0B5D2A]">
                Premium
              </h3>

              <span className="rounded-full bg-[#DCFCE7] px-4 py-2 text-sm font-bold text-[#166534]">
                {premiumTotal}
                /
                {selectedPackage.premiumLimit}
                kg
              </span>

            </div>

            <div className="mt-8 space-y-5">

              {products.premium.map((product) => {

                const qty =
                  quantities[product] || 0;

                return (

                  <div
                    key={product}
                    className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] p-4"
                  >

                    <div>

                      <p className="font-bold text-[#111827]">
                        {product}
                      </p>

                      <p className="text-sm text-[#6B7280]">
                        1 kg
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() =>
                          updateQuantity(
                            product,
                            "premium",
                            "remove"
                          )
                        }
                        className="h-10 w-10 rounded-full bg-[#F3F4F6] text-xl font-bold"
                      >
                        -
                      </button>

                      <span className="w-8 text-center text-lg font-bold">
                        {qty}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            product,
                            "premium",
                            "add"
                          )
                        }
                        className="h-10 w-10 rounded-full bg-[#0B7A33] text-xl font-bold text-white"
                      >
                        +
                      </button>

                    </div>

                  </div>

                );
              })}

            </div>

          </div>
          {/* REGULAR */}
          <div className="rounded-[32px] bg-white p-8 shadow-lg">

            <div className="flex items-center justify-between">

              <h3 className="text-3xl font-extrabold text-[#0B5D2A]">
                Regular
              </h3>

              <span className="rounded-full bg-[#FEF3C7] px-4 py-2 text-sm font-bold text-[#92400E]">
                {regularTotal}
                /
                {selectedPackage.regularLimit}
                kg
              </span>

            </div>

            <div className="mt-8 space-y-5">

              {products.regular.map((product) => {

                const qty =
                  quantities[product] || 0;

                return (

                  <div
                    key={product}
                    className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] p-4"
                  >

                    <div>

                      <p className="font-bold text-[#111827]">
                        {product}
                      </p>

                      <p className="text-sm text-[#6B7280]">
                        1 kg
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() =>
                          updateQuantity(
                            product,
                            "regular",
                            "remove"
                          )
                        }
                        className="h-10 w-10 rounded-full bg-[#F3F4F6] text-xl font-bold"
                      >
                        -
                      </button>

                      <span className="w-8 text-center text-lg font-bold">
                        {qty}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            product,
                            "regular",
                            "add"
                          )
                        }
                        className="h-10 w-10 rounded-full bg-[#0B7A33] text-xl font-bold text-white"
                      >
                        +
                      </button>

                    </div>

                  </div>

                );
              })}

            </div>

          </div>

          {/* COMPLEMENTARIA */}
          <div className="rounded-[32px] bg-white p-8 shadow-lg">

            <div className="flex items-center justify-between">

              <h3 className="text-3xl font-extrabold text-[#0B5D2A]">
                Complementaria
              </h3>

              <span className="rounded-full bg-[#DBEAFE] px-4 py-2 text-sm font-bold text-[#1D4ED8]">
                {complementaryTotal}
                /
                {selectedPackage.complementaryLimit}
                kg
              </span>

            </div>

            <div className="mt-8 space-y-5">

              {products.complementary.map((product) => {

                const qty =
                  quantities[product] || 0;

                return (

                  <div
                    key={product}
                    className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] p-4"
                  >

                    <div>

                      <p className="font-bold text-[#111827]">
                        {product}
                      </p>

                      <p className="text-sm text-[#6B7280]">
                        1 kg
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() =>
                          updateQuantity(
                            product,
                            "complementary",
                            "remove"
                          )
                        }
                        className="h-10 w-10 rounded-full bg-[#F3F4F6] text-xl font-bold"
                      >
                        -
                      </button>

                      <span className="w-8 text-center text-lg font-bold">
                        {qty}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            product,
                            "complementary",
                            "add"
                          )
                        }
                        className="h-10 w-10 rounded-full bg-[#0B7A33] text-xl font-bold text-white"
                      >
                        +
                      </button>

                    </div>

                  </div>

                );
              })}

            </div>

          </div>

        </div>

        {/* RESUMEN + DATOS */}
        <div className="mt-16 rounded-[36px] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.06)] lg:p-12">

          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr]">

            {/* RESUMEN */}
            <div>

              <span className="mb-5 inline-flex rounded-full bg-[#73C23A]/12 px-5 py-2 text-sm font-bold uppercase tracking-wide text-[#0B5D2A]">
                Resumen del pedido
              </span>

              <h3 className="text-4xl font-extrabold text-[#0B5D2A]">
                Tu selección
              </h3>

              <div className="mt-8 space-y-4">

                {selectedProducts.length === 0 && (

                  <p className="text-lg text-[#6B7280]">
                    Aún no has seleccionado productos.
                  </p>

                )}

                {selectedProducts.map(([product, qty]) => (

                  <div
                    key={product}
                    className="flex items-center justify-between rounded-2xl bg-[#F9FAFB] p-4"
                  >

                    <p className="font-semibold">
                      {product}
                    </p>

                    <span className="font-bold text-[#0B5D2A]">
                      {qty}
                      {" "}
                      kg
                    </span>

                  </div>

                ))}

              </div>

              <div className="mt-8 rounded-2xl bg-[#DCFCE7] p-5">

                <p className="text-lg font-bold text-[#166534]">
                  Total configurado
                </p>

                <p className="mt-2 text-4xl font-extrabold text-[#0B5D2A]">
                  {totalKg}
                  {" "}
                  KG
                </p>

              </div>

            </div>

            {/* DATOS */}
            <div>

              <span className="mb-5 inline-flex rounded-full bg-[#FEF3C7] px-5 py-2 text-sm font-bold uppercase tracking-wide text-[#92400E]">
                Datos de contacto
              </span>

              <h3 className="text-4xl font-extrabold text-[#0B5D2A]">
                Finaliza tu pedido
              </h3>

              <div className="mt-8 space-y-5">

                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(e.target.value)
                  }
                  className="w-full rounded-2xl border border-[#D1D5DB] bg-white px-5 py-5 text-lg font-semibold outline-none"
                />

                <input
                  type="text"
                  placeholder="WhatsApp"
                  value={customerWhatsapp}
                  onChange={(e) =>
                    setCustomerWhatsapp(e.target.value)
                  }
                  className="w-full rounded-2xl border border-[#D1D5DB] bg-white px-5 py-5 text-lg font-semibold outline-none"
                />

                <input

                  type="text"

                  placeholder="Código Postal"

                  value={customerCp}

                  onChange={(e) =>

                    setCustomerCp(e.target.value)

                  }
                  className="w-full rounded-2xl border border-[#D1D5DB] bg-white px-5 py-5 text-lg font-semibold outline-none"

                />

                <input
                  type="text"
                  placeholder="Colonia (opcional)"
                  value={customerColony}
                  onChange={(e) =>
                    setCustomerColony(e.target.value)
                  }
                  className="w-full rounded-2xl border border-[#D1D5DB] bg-white px-5 py-5 text-lg font-semibold outline-none"
                />

                <button
                  onClick={handleCustomerCoverageCheck}
                  className="w-full rounded-2xl bg-[#0B7A33] px-6 py-5 text-lg font-extrabold text-white transition hover:bg-[#086228]"
                >
                  Verificar cobertura
                </button>

                {checked && hasCoverage && (

                  <div className="rounded-2xl border border-[#86EFAC] bg-[#DCFCE7] p-5">

                    <p className="font-bold text-[#166534]">
                      ¡Sí tenemos cobertura!
                    </p>

                    <p className="mt-2 text-2xl font-extrabold text-[#0B5D2A]">
                      {zoneName}
                    </p>

                  </div>

                )}

                {checked && !hasCoverage && (

                  <div className="rounded-2xl border border-[#FCD34D] bg-[#FEF3C7] p-5">

                    <p className="font-bold text-[#92400E]">
                      Aún no tenemos cobertura en esta zona.
                    </p>

                  </div>

                )}

                <a
                  href={finalWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {

                    // @ts-ignore
                    window.gtag?.("event", "click_whatsapp", {

                      event_category: "conversion",
                      event_label: selectedPackage.name,
                      value: totalKg,

                    });

                  }}
                  className={`inline-flex w-full items-center justify-center rounded-2xl px-6 py-5 text-lg font-extrabold text-white transition ${
                    packageCompleted &&
                    hasCoverage &&
                    customerName &&
                    customerWhatsapp &&
                    customerCp
                      ? "bg-[#FF6B00] hover:bg-[#EA5F00]"
                      : "pointer-events-none bg-gray-400"
                  }`}
                >
                  Continuar por WhatsApp
                </a>

              </div>

            </div>

          </div>

        </div>

      </section>

      )}

      {/* COBERTURA */}
      <section
        id="cobertura"
        className="mx-auto max-w-7xl px-5 py-10 lg:px-8"
      >

        <div className="overflow-hidden rounded-[40px] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)]">

          <picture>

            <source
              media="(max-width: 767px)"
              srcSet="/images/cobertura-cdmx-mobile.png"
            />

            <source
              media="(max-width: 1023px)"
              srcSet="/images/cobertura-cdmx-tablet.png"
            />

            <img
              src="/images/cobertura-cdmx-desktop.png"
              alt="Cobertura"
              className="w-full object-cover"
            />

          </picture>

        </div>

      </section>
      {/* MINI VALIDADOR COBERTURA */}
      <section className="mx-auto max-w-4xl px-5 py-6 lg:px-8">

        <div className="rounded-[32px] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">

          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">

            <div>

              <p className="text-sm font-bold uppercase tracking-wide text-[#0B5D2A]">
                Verifica cobertura
              </p>

              <h3 className="mt-2 text-3xl font-extrabold text-[#0B5D2A]">
                ¿Llegamos a tu zona?
              </h3>

              <p className="mt-3 text-[#6B7280]">
                Ingresa tu código postal.
              </p>

            </div>

            <div className="flex flex-col gap-4 sm:flex-row">

              <input
                type="text"
                value={coverageCp}
                maxLength={5}
                onChange={(e) => setCoverageCp(e.target.value)}
                placeholder="03100"
                className="rounded-2xl border border-[#D1D5DB] bg-white px-5 py-4 text-lg font-semibold outline-none"

              /> 

              <button
                onClick={handleCoverageCheck}
                className="rounded-2xl bg-[#0B7A33] px-8 py-4 font-extrabold text-white transition hover:bg-[#086228]"
              >
                Verificar
              </button>

            </div>

          </div>

          {coverageChecked && coverageHasCoverage && (

            <div className="mt-6 rounded-2xl border border-[#86EFAC] bg-[#DCFCE7] p-5">

              <p className="font-bold text-[#166534]">
                ¡Sí tenemos cobertura!
              </p>

              <p className="mt-2 text-xl font-extrabold text-[#0B5D2A]">
                {coverageZoneName}
              </p>

            </div>

          )}

          {coverageChecked && !coverageHasCoverage && (

            <div className="mt-6 rounded-2xl border border-[#FCD34D] bg-[#FEF3C7] p-5">

              <p className="font-bold text-[#92400E]">
                Aún no tenemos cobertura en esta zona.
              </p>

            </div>

          )}

        </div>

      </section>
      {/* TESTIMONIOS */}
      <section
        id="testimonios"
        className="mx-auto max-w-7xl px-5 py-10 lg:px-8"
      >

        <div className="overflow-hidden rounded-[40px] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)]">

          <picture>

            <source
              media="(max-width: 767px)"
              srcSet="/images/testimonios-abasto-mobile.png"
            />

            <source
              media="(max-width: 1023px)"
              srcSet="/images/testimonios-abasto-tablet.png"
            />

            <img
              src="/images/testimonios-abasto-desktop.png"
              alt="Testimonios"
              className="w-full object-cover"
            />

          </picture>

        </div>

      </section>

      {/* APP */}
      <section
        id="app-experience"
        className="mx-auto max-w-7xl px-5 py-10 pb-20 lg:px-8"
      >

        <div className="overflow-hidden rounded-[40px] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)]">

          <picture>

            <source
              media="(max-width: 767px)"
              srcSet="/images/app-experience-abasto-mobile.png"
            />

            <source
              media="(max-width: 1023px)"
              srcSet="/images/app-experience-abasto-tablet.png"
            />

            <img
              src="/images/app-experience-abasto-desktop.png"
              alt="Experiencia App"
              className="w-full object-cover"
            />

          </picture>

        </div>

      </section>

    </main>

  );
}
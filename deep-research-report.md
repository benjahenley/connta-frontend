# Argentine Web Platforms for Automated ARCA E‑Invoicing With CAE

## Executive summary

Argentina’s electronic invoicing ecosystem is now operated by **ARCA (Agencia de Recaudación y Control Aduanero)**, the legal successor to AFIP created by **Decree 953/2024**. citeturn5view0 Most commercial “facturación electrónica” platforms automate the same core workflow: authenticate to ARCA web services, request an authorization (typically **CAE**, or **CAEA** for contingency), then generate the customer-facing document that includes ARCA-required fiscal data and a scannable **QR** (mandatory for electronic invoices under ARCA rules). citeturn3view0turn4view0

Across current active Argentine web platforms, the market splits into three practical categories:

1) **Business ERPs / accounting systems with embedded e‑invoicing** (e.g., Xubio, Contabilium, Colppy, SiFactura, Cobalto, SistemaDeFacturacion.com.ar). These typically add inventory, AR/AP, taxes, and reporting on top of CAE issuance. citeturn10view0turn11view0turn23view0turn25search0turn22search2turn23view1  
2) **E‑commerce/batch automation specialists** (e.g., Facturante) focused on emitting invoices automatically from marketplace/storefront orders, with batch issuance and integrations. citeturn18view2turn17view2  
3) **API-first “CAE engines” for integrators** (e.g., TusFacturasAPP API, Afip SDK, and FAEARG), offering REST endpoints that abstract ARCA’s WS complexity and commonly return CAE + generate PDF/QR. citeturn29search1turn29search0turn29search11turn30search0

**Best-fit recommendations (short):**  
For **accounting studios**, prioritize platforms designed for multi-client workflows and collaboration (not just invoicing) such as **Colppy (strong studio positioning + ARCA validations + tax calendar/IVA tools)** and **Xubio’s Studio (“Estudio”) plans** for managing/accounting visibility—while noting Xubio explicitly states studio plans **do not issue invoices on behalf of clients**. citeturn11view2turn21search0  
For **small businesses**, the strongest mainstream options are typically **Xubio (broad SME suite + strong integrations)**, **Contabilium (ERP + plans scaled by comprobantes/users/CUIT)**, and **Alegra (low entry pricing + 24/7 support + AFIP authorization via a technology provider)**. citeturn20search0turn21search4turn10view0turn15search1turn15search0  
For teams that need **deep automation/custom integration**, start with **TusFacturasAPP API** (explicit CAE + QR + many tiered plans) or **Afip SDK** (USD-priced developer-oriented stack), and consider **FAEARG** for custom-volume implementations (pricing is quote-based). citeturn29search1turn29search0turn29search11turn30search0

## Regulatory context and what “automatic CAE + ARCA format” means

ARCA operates the electronic invoicing web services used by platforms. The **WSFEv1** documentation describes the **Electronic Invoice** service used to report invoices/notes and obtain authorizations such as **CAE** (and CAEA). citeturn3view0

Electronic invoices must also include a **QR code** under Argentina’s e‑invoice rules (ARCA references RG 4291/2018 for the QR requirement and provides official guidance for QR generation/validation). citeturn4view0

In this report, **“Automated CAE certification”** means the platform (or its API) requests the authorization from ARCA as part of the issuance flow (instead of you manually issuing in “Comprobantes en Línea”). **“ARCA invoice format generation”** means the platform can generate the electronic invoice document (typically PDF) with the fiscal fields ARCA expects (invoice type and numbering, CAE and expiration, QR, etc.)—either explicitly stated or strongly implied by “homologado/validado con ARCA” positioning. citeturn3view0turn4view0turn23view0turn22search2

## Platform-by-platform analysis with plan and pricing tables

### Xubio

**Official website:** Xubio (Argentina) citeturn20search0turn21search4turn21search0  

**Positioning and core strengths:** A broad **SME management + accounting** cloud suite with strong commerce/payment integrations and pathways for accountants. Xubio highlights that it submits (“presents”) the electronic invoice to AFIP/ARCA on your behalf and supports invoice types **A, B, C and E**, with a free allowance for low-volume users. citeturn20search0turn21search3turn20search7

**Automated CAE certification:** **Yes (inferred from ARCA workflow) for business plans**. Xubio states “Xubio presents your electronic invoice to AFIP,” which implies it uses ARCA services that return the authorization (CAE/CAEA) for a valid e-invoice. citeturn20search0turn3view0  
**Important studio limitation:** Xubio’s **Estudio** plans explicitly say they **do not allow issuing electronic invoices for clients**. citeturn21search0

**ARCA invoice format generation:** **Yes** (supports e-invoicing and indicates QR readiness for AFIP/ARCA). citeturn21search1turn4view0

**Differentiators and extras:** Mass invoicing via integrations (e.g., Mercado Libre / Tiendanube / Mercado Pago), plus an API mentioned in plan features; sales, purchases, and accounting/tax reporting features are emphasized across plan pages. citeturn20search7turn21search4turn21search0

**Audience:** Mixed—**general businesses** (emprendedores/empresas) and **accounting studios** (estudio). citeturn21search0turn21search4

**Trust indicators / reviews:** Tiendanube app listing shows **3.5 rating (15 evaluations)** for Xubio’s integration. citeturn20search2

#### Xubio pricing and plans

**Emprendedores (personas humanas)** citeturn21search3

| Plan | Monthly price (ARS) | Annual price | Trial / free | Key limits called out |
|---|---:|---|---|---|
| Emprendedor Gratis | ARS 0 | Unspecified | Free “sin límites de tiempo” for new accounts | 10 comprobantes/month; 1 user |
| Emprendedor Estándar | Bank debit ARS 40,400 + IVA/month (page also displays ARS 20,200 + IVA; pricing context not fully explicit in the captured text); other payments ARS 52,600 + IVA/month | Unspecified | 14‑day trial (paid plans) | 1,000 comprobantes/month; 2 users |
| Emprendedor Ilimitado | Bank debit ARS 81,800 + IVA/month; other payments ARS 108,800 + IVA/month | Unspecified | 14‑day trial | Comprobantes ilimitados; users ilimitados |

**Empresas** citeturn21search4

| Plan | Monthly price (ARS) | Annual price | Trial / free | Key limits called out |
|---|---:|---|---|---|
| Empresa Gratis | ARS 0 | Unspecified | Free “sin límites de tiempo” for new accounts | 10 comprobantes/month; contabilidad; 1 user |
| Empresa Básico | Bank debit ARS 82,900 + IVA/month (page also displays ARS 41,450 + IVA; pricing context not fully explicit in the captured text); other payments ARS 107,500 + IVA/month | Unspecified | 14‑day trial | 300 comprobantes/month; 3 users |
| Empresa Estándar | Bank debit ARS 134,300 + IVA/month; other payments ARS 171,600 + IVA/month | Unspecified | 14‑day trial | 1,000 comprobantes/month; 5 users |
| Empresa Avanzado | Bank debit ARS 180,100 + IVA/month; other payments ARS 230,900 + IVA/month | Unspecified | 14‑day trial | 3,000 comprobantes/month; 10 users |
| Empresa Pro | Bank debit ARS 253,900 + IVA/month; other payments ARS 323,600 + IVA/month | Unspecified | 14‑day trial | 10,000 comprobantes/month; 20 users |

**Estudio (contadores y estudios contables)** citeturn21search0

| Plan | Monthly price (ARS) | Annual price | Trial / free | Key limits called out |
|---|---:|---|---|---|
| Estudio Gratis | ARS 0 | Unspecified | Free “sin límites de tiempo” for new accounts | 1 client; 1 user; “Impuestos y contabilidad” |
| Estudio Básico | Bank debit ARS 40,400 + IVA/month (page also displays ARS 20,200 + IVA; pricing context not fully explicit in the captured text); other payments ARS 52,600 + IVA/month | Unspecified | 14‑day trial | 10 clients; 1 user |
| Estudio Estándar | Bank debit ARS 82,600 + IVA/month; other payments ARS 109,800 + IVA/month | Unspecified | 14‑day trial | 30 clients; 3 users |
| Estudio Pro | Bank debit ARS 135,600 + IVA/month; other payments ARS 173,300 + IVA/month | Unspecified | 14‑day trial | 100 clients; 10 users |
| Estudio Ilimitado | Bank debit ARS 221,200 + IVA/month; other payments ARS 285,300 + IVA/month | Unspecified | 14‑day trial | Clients/users ilimitados |

### Contabilium

**Official website:** Contabilium (Argentina) citeturn10view0turn10view1  

**Positioning and core strengths:** A cloud ERP with plan tiers tightly tied to **comprobantes/month, SKUs, CUITs, users, and points of sale**. It emphasizes centralized e-invoicing, tracking invoice status across devices, and automated reminders. citeturn10view0turn10view1

**Automated CAE certification:** **Yes (inferred)**. Contabilium markets “facturación electrónica” compliant with AFIP requirements; CAE is the standard ARCA authorization mechanism for valid electronic invoices under WSFEv1. citeturn10view1turn3view0

**ARCA invoice format generation:** **Yes (expected)**, but details like QR are not explicitly shown in the captured pricing excerpt; ARCA requires QR on electronic invoices. citeturn4view0turn10view1

**Differentiators and extras:** E‑commerce integrations are highlighted; higher tiers include features like **abonos / recurrent billing**, bulk imports, cost centers, bi-currency, and an **API for developers** (Full/Enterprise). citeturn10view0turn10view1

**Audience:** Primarily **general businesses/SMEs** scaling in volume and complexity. citeturn10view0

**Trust indicators:** The pricing page highlights large usage claims (e.g., “más de 20.000 usuarios… 24hrs del día”) and displays recognizable customer logos. citeturn10view0

#### Contabilium pricing and plans (Argentina)

citeturn10view0turn10view1

| Plan | Monthly price (ARS) | Annual price | Trial / free | Key limits called out |
|---|---:|---|---|---|
| Free | ARS 0 | Unspecified | Free | Up to 20 comprobantes; 10 SKUs; 1 CUIT; 1 user; 1 point of sale |
| Basic | ARS 46,000 + IVA/month | “10% OFF pagando anual” (exact annual ARS not shown) | 10‑day trial | Up to 250 comprobantes; 100 SKUs; 1 CUIT; 1 user; 1 PV |
| Standard | ARS 110,000 + IVA/month | “10% OFF pagando anual” (exact annual ARS not shown) | 10‑day trial | Up to 1,500 comprobantes; 5,000 SKUs; 1 CUIT; 2 users; 2 PV |
| Pro | ARS 160,000 + IVA/month | “10% OFF pagando anual” (exact annual ARS not shown) | 10‑day trial | Up to 5,000 comprobantes; 10,000 SKUs; 2 CUITs; 10 users; 3 PV |
| Full | ARS 220,000 + IVA/month | “10% OFF pagando anual” (exact annual ARS not shown) | 10‑day trial | Up to 10,000 comprobantes; 20,000 SKUs; 3 CUITs; users/PV “ilimitados” |
| Enterprise | Unspecified (custom) | Unspecified | Contact sales | Custom plan |

### Colppy

**Official website:** Colppy citeturn11view0turn11view1turn11view2  

**Positioning and core strengths:** Strongly positioned for **PyMEs and accounting studios**, with emphasis on ARCA compliance, collaboration/roles, fiscal calendar, and operational automation. Colppy repeatedly describes invoices as **validated by ARCA** and describes **automatic validation** to reduce errors/rejections. citeturn11view0turn11view2

**Automated CAE certification:** **Yes** (platform describes ARCA-connected validation for every invoice). citeturn11view0turn11view1

**ARCA invoice format generation:** **Yes.** Colppy explicitly lists invoice types and states they are validated with ARCA (e.g., A/B/C/E/T; plus additional types across plan comparison tables). citeturn11view1turn12view0

**Differentiators and extras:** Mobile apps (Android/iOS), integrations (e.g., Mercado Pago, Tiendanube, Mercado Libre and others shown), tax calendar and “IVA Simple” support detail, multi-currency capabilities, bank connectivity/conciliation, and retentions/perceptions tooling (ARBA/CABA mentioned). citeturn11view1turn12view0turn11view0

**Audience:** **Both**, but notably strong content for **studios** (centralize clients, permissions, secure servers, and dedicated programs for accountants). citeturn11view2turn11view0

**Reliability / quality signals:** Colppy displays an **ISO 9001:2015** quality certification badge on its site. citeturn11view1

#### Colppy pricing and plans (monthly shown)

citeturn13view0turn12view0turn13view1turn13view2

| Plan | Monthly price (ARS) | Annual price | Trial / free | Key limits called out |
|---|---:|---|---|---|
| Essential | ARS 106,500 + IVA/month | Unspecified | Trial unspecified in captured pricing section | 300 facturas (compra/venta) |
| Platinum | ARS 156,900 + IVA/month | Unspecified | Trial unspecified in captured pricing section | 1,000 facturas (compra/venta) |
| Full | ARS 216,900 + IVA/month | Unspecified | Trial unspecified in captured pricing section | 3,000 facturas (compra/venta) |
| Enterprise | ARS 257,900 + IVA/month | Unspecified | Trial unspecified in captured pricing section | 7,000 facturas (compra/venta) |
| Colppy Plus Enterprise | ARS 627,500 + IVA/month | Unspecified | Trial mentioned (“Probalo gratis” button) | Enterprise onboarding/enablement package (advisory + training + usage reports) |

### Alegra

**Official website:** Alegra Argentina citeturn15search0turn15search1turn15search5  

**Positioning and core strengths:** A streamlined SaaS for small businesses with strong **support positioning (24/7)** and a low entry price. citeturn15search0turn15search1

**Automated CAE certification:** **Yes (via provider).** Alegra states it is authorized by AFIP **through the technology provider Linkside**. citeturn15search0  
It also highlights **CAEA** as a contingency method to keep invoicing when AFIP/ARCA systems are down. citeturn15search0turn3view0

**ARCA invoice format generation:** **Partial (per captured page details).** The FAQ excerpt lists issuance of A/B/C invoices and credit notes; it does not explicitly list all ARCA types or QR in the captured pricing snippet. citeturn15search0turn4view0

**Differentiators and extras:** Free plan documentation for Argentina is unusually explicit about operational limits (invoices, users, income cap), which is helpful for tiny operations. citeturn15search5

**Audience:** Mostly **general businesses**; it commonly pairs “owner + accountant user” in plan descriptions. citeturn15search1turn15search5

#### Alegra pricing and plans (Facturación Electrónica product)

citeturn15search1turn15search5turn15search0

| Plan | Monthly price (ARS) | Annual price | Trial / free | Key limits called out |
|---|---:|---|---|---|
| Plan Gratis | ARS 0 | Unspecified | Free | 10 sales invoices/month; 10 vendor invoices/month; 1 user; 1 inventory location; income up to ARS 100,000/month (per help doc) |
| Emprendedor | ARS 5,999 (no IVA) | “10% OFF” annual toggle (exact annual ARS not shown in snippet) | 15‑day trial | 10 sales invoices/month; 2 users; e‑invoicing included; 24/7 support |
| Pyme | ARS 11,999 (no IVA) | “10% OFF” annual toggle (exact annual ARS not shown) | 15‑day trial | 50 sales invoices/month; 2 users; e‑invoicing included; 24/7 support |
| Pro | ARS 19,999 (no IVA) | “10% OFF” annual toggle (exact annual ARS not shown) | 15‑day trial | 250 sales invoices/month; 2 users; e‑invoicing included; 24/7 support |
| Plus | ARS 29,999 (no IVA) | “10% OFF” annual toggle (exact annual ARS not shown) | 15‑day trial | 500 sales invoices/month; 3 users; e‑invoicing included; 24/7 support |
| Premium | Unspecified (shown as “solución acorde a tu negocio”) | Unspecified | Trial implied | “+1,000” sales invoices/month and more (details require “Conocé más”) |

### Facturante

**Official website:** Facturante citeturn18view2turn16view0  

**Positioning and core strengths:** Built around **automation**: connect sales channels (Mercado Libre, Mercado Pago, Tiendanube, etc.) and generate/send invoices. It explicitly says it validates your invoices with **ARCA** and promotes a **15‑day free trial**. citeturn18view2

**Automated CAE certification:** **Yes (inferred).** Facturante states it “validates with ARCA”; within ARCA’s WSFE flow, validation/authorization of an electronic invoice implies obtaining CAE/CAEA. citeturn18view2turn3view0

**ARCA invoice format generation:** **Yes (expected).** It positions itself as ensuring compliance with ARCA norms and automating issue+delivery; QR is mandatory in ARCA e-invoicing even if not explicitly mentioned in the captured lines. citeturn18view2turn4view0

**Differentiators and extras:** Plans explicitly include **batch issuance**, e‑commerce integrations, and an **API for integrating your own platform**. citeturn18view2turn17view2

**Audience:** Mostly **general businesses** (especially e‑commerce), but can be used by accounting operations that need consistent automated issuance. citeturn18view2

**User reviews / trust indicators:** Tiendanube listing shows **3.8 rating (75 evaluations)**, plus it claims “más de 15.000 empresas” and displays major brand logos on its site. citeturn16view2turn18view2

#### Facturante pricing and plans

The plans page shows both **monthly** and **annual** (discounted) pricing, with “Ahorrá un 25%”. citeturn17view0turn17view2turn17view3turn17view1

| Plan | Monthly price (ARS) | Annual price (shown as discounted monthly) | Trial / free | Key limits called out |
|---|---:|---:|---|---|
| Pack 50 | ARS 12,462 + IVA/month | ARS 9,346.50 (25% off) | 15‑day trial | 50 comprobantes/month; 3 users; excedente pricing shown |
| Pack 150 | ARS 25,278 + IVA/month | ARS 18,958.50 (25% off) | 15‑day trial | 150 comprobantes/month; users “ilimitados”; excedente pricing shown |
| Pack 300 | ARS 34,142 + IVA/month | ARS 25,606.50 (25% off) | 15‑day trial | 300 comprobantes/month; users “ilimitados”; excedente pricing shown |
| Pack 500 | ARS 42,035 + IVA/month | ARS 31,526.25 (25% off) | 15‑day trial | 500 comprobantes/month; users “ilimitados” |

### SiFactura

**Official website:** SiFactura (Argentina) citeturn22search0turn23view1  

**Positioning and core strengths:** A flexible ERP-style system with strong emphasis on **ARCA e‑invoicing across specialized regimes** (export, tourism/hotels, FCE, item-detail MTXCA, etc.) and an explicit story for API integration. citeturn22search0turn23view1

**Automated CAE certification:** **Yes (implied + operationally described).** In its FAQ it describes enabling the platform via **delegation of the invoicing service** and creating points of sale in ARCA—typical prerequisites for a system that will request authorizations automatically. citeturn23view1

**ARCA invoice format generation:** **Yes.** It explicitly lists many ARCA invoice types it can create (A, B, C, M, FCE, X, E/export) and supports domain-specific formats like “Factura T”. citeturn23view1turn22search0

**Differentiators and extras:**  
It mentions: multi-CUIT issuance, automated daily FX updates (Banco Nación), subscriptions/abonos with automatic billing and email delivery, bulk issuance via Excel, and integration options (Mercado Libre, Tienda Nube, WooCommerce). citeturn22search0turn23view1

**Audience:** Broad—professionals through larger companies; also explicit for “empresas de sistemas” wanting API integration. citeturn22search0turn23view1

**Trust indicators:** It publishes usage stats such as 894 clients and 3,500 users (self-reported). citeturn22search0

#### SiFactura pricing and plans

citeturn23view1

| Plan | Monthly price (ARS) | Annual price | Trial / free | Key limits called out |
|---|---:|---|---|---|
| Emprendedor | ARS 34,990 + IVA/month (debit) or ARS 48,990 + IVA/month (other) | “15% de descuento por pago anual” (annual ARS not specified) | Unspecified | Up to 100 “operaciones”; 2 users included; add’l users priced |
| Mediano | ARS 64,990 + IVA/month (debit) or ARS 78,990 + IVA/month (other) | “15% de descuento por pago anual” (annual ARS not specified) | Unspecified | Up to 400 “operaciones”; 2 users included; add’l users priced |
| Pyme | ARS 94,990 + IVA/month (debit) or ARS 114,990 + IVA/month (other) | “15% de descuento por pago anual” (annual ARS not specified) | Unspecified | Up to 3,000 “operaciones”; payroll module only in this plan (per notes) |

### Cobalto

**Official website:** Cobalto Gestión citeturn25search0turn23view0  

**Positioning and core strengths:** A modern SME management system with strong emphasis on **ARCA-native invoicing** and operational speed. Cobalto explicitly says it **obtains CAE in real time**, determines the correct invoice type automatically based on tax status, and can manage multiple points of sale per branch. citeturn23view0

**Automated CAE certification:** **Yes (explicit).** It states CAE is obtained automatically and in real time, with ARCA validation. citeturn23view0turn25search0

**ARCA invoice format generation:** **Yes (explicit for A/B/C and “homologada”)**; QR is not explicitly shown in the captured lines but QR is mandatory for ARCA e‑invoices. citeturn23view0turn4view0turn25search0

**Differentiators and extras:** Notable differentiator is an **AI assistant** that queries business data and generates reports (PDF/Excel), plus “Venta Rápida” UX for tablets/cellular. citeturn25search0

**Reliability / support notes:** Cobalto claims hosting on **AWS in Buenos Aires**, **99.9% availability**, and **hourly automatic backups**, plus human support (email/chat/WhatsApp). citeturn25search0turn23view0

**Audience:** General businesses; also includes a testimonial from an “Estudio Contable” user—suggesting relevance to studios that manage invoicing operations directly. citeturn25search0

#### Cobalto pricing and plans

citeturn25search0

| Plan | Monthly price (ARS) | Annual price (shown as discounted monthly) | Trial / free | Key limits called out |
|---|---:|---:|---|---|
| Básico | ARS 76,860/month | ARS 54,900/month (annual, “Ahorrá 20%”) | 7‑day free trial | Up to 1,000 products; 1 user; 1 branch; ARCA invoicing |
| Profesional | ARS 138,600/month | ARS 99,000/month (annual) | 7‑day free trial | Up to 5,000 products; up to 3 users; roles; stock controls |
| Avanzado | ARS 194,600/month | ARS 139,000/month (annual) | 7‑day free trial | Up to 10,000 products; up to 10 users; suppliers/purchases; banks/cheques; IVA book |
| Empresarial | Unspecified (quote) | Unspecified | Trial shown | Unlimited products/users; multi-branch; custom integrations |

### SistemaDeFacturacion.com.ar

**Official website:** Sistema de Facturación para PyMEs y Comercios citeturn22search2turn22search1  

**Positioning and core strengths:** A business-facing web system emphasizing **ARCA A/B/C invoices with CAE** plus POS, stock, customer management, and reporting. citeturn22search2

**Automated CAE certification:** **Yes (explicit).** It states it emits invoices “con CAE autorizado por ARCA.” citeturn22search2

**ARCA invoice format generation:** **Yes (explicit A/B/C + CAE).** citeturn22search2turn4view0

**Differentiators and extras:** POS features (barcode scanning, “caja rápida”), integrations (mentions Mercado Libre, Tiendanube and others), and plan-based scaling up to API and “Factura MiPyme”. citeturn22search2

**Audience:** General businesses. citeturn22search2

#### SistemaDeFacturacion.com.ar pricing and plans

citeturn22search2turn22search1

| Plan | Monthly price (ARS) | Annual price | Trial / free | Key limits called out |
|---|---:|---|---|---|
| Comercio | ARS 47,200 + IVA (per user per month) | Unspecified | Unspecified | “Comprobantes ilimitados”; ARCA 1 CUIT; POS/stock/core modules |
| Pyme | ARS 65,500 + IVA (per user per month) | Unspecified | Unspecified | ARCA 2 CUIT; adds multimoneda/sucursales/depositos/export invoicing |
| Pro | ARS 92,800 + IVA (per user per month) | Unspecified | Unspecified | ARCA 3 CUIT; adds Mercado Libre, IVA digital/simple, ARBA IIBB, WhatsApp invoicing |
| Empresas | ARS 121,300 + IVA (per user per month) | Unspecified | Unspecified | ARCA 4 CUIT; adds MiPyme, contabilidad, API, recurrent invoicing, BI/CRM |

### TusFacturasAPP

**Official website:** TusFacturasAPP citeturn29search2turn29search0turn29search1  

**Positioning and core strengths:** A mature (since 2015) web platform plus a robust API offering. It explicitly supports **ARCA invoice types** and also offers “facturar desde WhatsApp,” “facturar desde Excel,” scheduled/automatic issuance, and the ability to prepare invoices when ARCA is down and issue them automatically once services return. citeturn29search2turn29search1

**Automated CAE certification:** **Yes (explicit, especially for API).** The API page explicitly mentions **issuing invoices “con CAE y QR de ARCA”**. citeturn29search1turn4view0

**ARCA invoice format generation:** **Yes (explicit CAE + QR + PDF).** citeturn29search1

**Audience:** Both **business users** and **developers/integrators**; it has distinct plan families (business vs API) and emphasizes developer usability. citeturn29search2turn29search0

#### TusFacturasAPP trial/free (platform)

TusFacturasAPP states you can try it free and issue **up to 5 sales documents for 30 days** (renewable monthly) before subscribing. citeturn29search2

#### TusFacturasAPP API plan pricing (selected tiers shown on “Planes API” page)

The API plan page publishes “Tarifas vigentes al 07/02/2026” and even provides a reference USD exchange rate (1 USD = ARS 1,432) on that date; USD equivalents below are **approximate** using that vendor-published rate. citeturn29search0

| Plan | Monthly price (ARS, “Precio final por 30 días”) | Approx USD (vendor FX) | Annual price | Trial / free | Key limits called out |
|---|---:|---:|---|---|---|
| API26 1K4C | ARS 30,000 | ≈ USD 20.95 | Unspecified | Unspecified | Up to 1,000 comprobantes/requests per 30 days; up to 4 “puntos de venta” |
| API26 3K7C | ARS 80,000 | ≈ USD 55.87 | Unspecified | Unspecified | Up to 3,000 comprobantes/requests; up to 7 PV |
| API26 6K10C | ARS 130,000 | ≈ USD 90.78 | Unspecified | Unspecified | Up to 6,000 comprobantes/requests; up to 10 PV |
| API26 10K20C | ARS 190,000 | ≈ USD 132.68 | Unspecified | Unspecified | Up to 10,000 comprobantes/requests; up to 20 PV |
| API26 20K25C | ARS 250,000 | ≈ USD 174.58 | Unspecified | Unspecified | Up to 20,000 comprobantes/requests; up to 25 PV |
| API26 35K30C | ARS 550,000 | ≈ USD 384.08 | Unspecified | Unspecified | Up to 35,000 comprobantes/requests; up to 30 PV |
| API26 50K40C | ARS 700,000 | ≈ USD 488.83 | Unspecified | Unspecified | Up to 50,000 comprobantes/requests; up to 40 PV |
| API26 100K40C | ARS 1,300,000 | ≈ USD 907.82 | Unspecified | Unspecified | Up to 100,000 comprobantes/requests; up to 40 PV |
| API26 200K40C | ARS 2,600,000 | ≈ USD 1,815.64 | Unspecified | Unspecified | Up to 200,000 comprobantes/requests; up to 40 PV |

### Afip SDK

**Official website:** Afip SDK (commercial) citeturn29search11  

**Positioning and core strengths:** Developer-focused product that markets API connectivity to ARCA plus add-ons for PDF generation and “automations” to avoid manual work in ARCA. It explicitly states the site is commercial and not official. citeturn29search11

**Automated CAE certification:** **Yes (implied by “API de Factura Electrónica AFIP/ARCA”).** citeturn29search11turn3view0

**ARCA invoice format generation:** **Partial/optional.** Afip SDK lists PDF generation as an add-on feature tier rather than an always-included capability. citeturn29search11

**Audience:** Integrators, dev teams, and “no-code” users (it lists many languages and platforms). citeturn29search11

#### Afip SDK pricing and plans

citeturn29search11

| Plan | Monthly price (USD) | Monthly price (ARS) | Annual price | Trial / free | Key limits called out |
|---|---:|---:|---|---|---|
| Base plan | USD 250/month | Unspecified | Unspecified | Sandbox described as free | Includes 1,000 CUIT; 1M requests; email support; overage pricing for extra CUIT/requests |
| PDF add-on | Free (100 PDFs) → USD 5/month (1k PDFs) → USD 25/month (10k PDFs) → USD 150/month (100k PDFs + overage) | Unspecified | Unspecified | Free tier exists | PDF generation scaled by volume |
| Automations add-on | Free (100) → USD 50/month (1k) → USD 250/month (10k) → USD 1,500/month (100k + overage) | Unspecified | Unspecified | Free tier exists | “Automatizaciones” volume tiers |

### FAEARG

**Official website:** FAEARG citeturn30search0turn29search8  

**Positioning and core strengths:** Positioned explicitly as **infrastructure** (API + connectors) for ERPs/CRMs/SaaS and multi‑CUIT operations, with emphasis on operational continuity and compliance.

**Automated CAE certification:** **Yes (explicit).** It states compliance includes correct issuance and CAE handling. citeturn30search0turn29search8

**ARCA invoice format generation:** **Partial (depends on implementation).** The site emphasizes service components (CAE + status tracking), but does not publish a “PDF+QR included” promise in the captured overview. citeturn30search0turn4view0

**Pricing:** **Unspecified / quote-based**, defined by monthly CAE volume and implementation modality (self-implemented vs assisted vs turnkey). citeturn30search0

### FacturaGratis.com.ar

**Official website:** FacturaGratis.com.ar citeturn30search10  

**Positioning and core strengths:** A freemium e‑invoicing and admin system that highlights bulk/batch authorization, Excel import, recurrent workflows (presupuesto → factura), IVA digital/CITI reporting, and MercadoPago-related billing workflows. citeturn30search10

**Automated CAE certification:** **Yes (implied).** It describes invoices “autorizados por AFIP” and supports batch authorization; for electronic invoices, that implies CAE/CAEA authorization. citeturn30search10turn3view0

**ARCA invoice format generation:** **Partial.** It explicitly references ARCA/AFIP and authorized invoices; QR is mandatory under ARCA but not explicitly stated in the captured excerpt. citeturn30search10turn4view0

#### FacturaGratis.com.ar pricing and plans

citeturn30search10

| Plan | Monthly price (ARS) | Annual price | Trial / free | Key limits called out |
|---|---:|---|---|---|
| free | ARS 0/month | Unspecified | Free | 20 comprobantes/month (facturas + notas) |
| master | ARS 7,116/month | Annual option shown (“Pagá 1 Mes menos!”) but exact annual ARS not stated in snippet | Unspecified | 200 comprobantes/month |
| gold | ARS 16,104/month | Annual option shown but exact annual ARS not stated in snippet | Unspecified | 1,000 comprobantes/month |
| full | ARS 27,504/month | Annual option shown but exact annual ARS not stated in snippet | Unspecified | Sin límite de comprobantes/month |

## Cross-platform comparison table

Key: **CAE automation** = whether the platform explicitly states CAE issuance or clearly describes ARCA validation/authorization; **ARCA format** = whether ARCA-compliant invoice document generation is explicit vs implied.

| Platform | Primary segment | Starting paid price (as listed) | Free / trial | CAE automation | ARCA invoice format support | Automation/integrations highlights |
|---|---|---:|---|---|---|---|
| Xubio | Businesses + studios | Emprendedor Estándar ARS 40,400 + IVA/mo (bank debit) citeturn21search3 | Free tier + 14‑day trial citeturn21search3turn21search4 | Yes (inferred via “presenta a AFIP”) citeturn20search0turn3view0 | Yes (QR readiness mentioned) citeturn21search1turn4view0 | E‑commerce/payment integrations; mass issuance citeturn20search7 |
| Contabilium | Businesses (ERP) | Basic ARS 46,000 + IVA/mo citeturn10view0 | Free + 10‑day trial citeturn10view0turn10view1 | Yes (inferred) citeturn10view1turn3view0 | Yes (expected; QR not explicit) citeturn4view0turn10view1 | Recurring billing, bulk import, higher-tier API citeturn10view0 |
| Colppy | Studios + businesses | Essential ARS 106,500 + IVA/mo citeturn13view0 | Trial not explicit in captured pricing block | Yes (ARCA validation described) citeturn11view0 | Yes (types listed; “validadas”) citeturn11view1turn12view0 | Mobile apps; Mercado Pago + other integrations; IVA tooling citeturn11view1turn12view0 |
| Alegra | Businesses | Emprendedor ARS 5,999 (no IVA) citeturn15search1 | Free plan + 15‑day trial citeturn15search5turn15search1 | Yes (via Linkside; CAEA contingency) citeturn15search0 | Partial (A/B/C mentioned; QR not explicit) citeturn15search0turn4view0 | Strong support positioning; CAEA continuity citeturn15search0 |
| Facturante | E‑commerce automation | Pack 50 ARS 12,462 + IVA/mo citeturn17view0 | 15‑day trial citeturn18view2 | Yes (inferred; ARCA validation) citeturn18view2turn3view0 | Yes (expected; QR not explicit) citeturn4view0turn18view2 | Marketplace/store integrations + API; batch issuance citeturn18view2turn17view2 |
| SiFactura | Businesses + integrators | Emprendedor ARS 34,990 + IVA/mo (debit) citeturn23view1 | Unspecified | Yes (describes ARCA delegation & PV setup) citeturn23view1 | Yes (many regimes/types listed) citeturn22search0turn23view1 | MTXCA, Factura T, FCE, export; API citeturn22search0turn23view1 |
| Cobalto | Businesses | ARS 76,860/mo citeturn25search0 | 7‑day trial citeturn25search0 | Yes (explicit CAE real-time) citeturn23view0turn25search0 | Yes (explicit A/B/C; QR implied) citeturn25search0turn4view0 | AI assistant; AWS BA; IVA book in higher tier citeturn25search0 |
| SistemaDeFacturacion.com.ar | Businesses | ARS 47,200 + IVA/user/mo citeturn22search2 | Unspecified | Yes (explicit CAE) citeturn22search2 | Yes (A/B/C + CAE) citeturn22search2 | POS + barcode + integrations; API on top tier citeturn22search2 |
| TusFacturasAPP | Businesses + integrators | API26 1K4C ARS 30,000/30d citeturn29search0 | 5 docs / 30 days free (platform) citeturn29search2 | Yes (explicit CAE + QR) citeturn29search1 | Yes (explicit QR) citeturn29search1turn4view0 | API + WhatsApp + Excel + scheduled issuance citeturn29search2turn29search1 |
| Afip SDK | Integrators/devs | USD 250/mo citeturn29search11 | Sandbox free (stated) citeturn29search11 | Yes (implied) citeturn29search11turn3view0 | Partial (PDF is add-on tiers) citeturn29search11 | Multi-language docs + automation add-ons citeturn29search11 |
| FAEARG | Integrators + custom | Quote-based citeturn30search0 | Unspecified | Yes (explicit CAE handling) citeturn30search0turn29search8 | Partial (implementation-dependent) citeturn30search0turn4view0 | Integration-assisted/turnkey options citeturn30search0 |
| FacturaGratis.com.ar | SMBs | ARS 7,116/mo citeturn30search10 | Free tier citeturn30search10 | Yes (implied “autorizados por AFIP”) citeturn30search10turn3view0 | Partial (QR not explicit) citeturn30search10turn4view0 | Batch authorization; Excel import; MercadoPago workflows citeturn30search10 |

## How CAE automation typically works in these platforms

The underlying mechanics are broadly consistent: the platform authenticates to ARCA services and requests authorization for each invoice or batch, receiving back CAE (or CAEA in contingency regimes supported by ARCA). citeturn3view0turn15search0

```mermaid
flowchart TD
  U[Business / Studio / System] --> P[Web platform / API]
  P --> A1[ARCA authentication (cert/key → token)]
  A1 --> W[ARCA WSFEv1: request authorization]
  W -->|CAE (or CAEA for contingency)| R[Authorization response + expiry]
  P --> D[Generate invoice document (PDF) with fiscal data + QR]
  D --> C[Deliver: email / download / API response]
  P --> L[Store logs, status, IVA books, reports]
```

ARCA’s WSFEv1 documentation frames the service as supporting **CAE/CAEA** flows, while ARCA also mandates the **QR** on electronic invoices—so “fully automated” solutions usually include: CAE request, CAE storage + expiry tracking, and QR/PDF generation for the emitted comprobante. citeturn3view0turn4view0

A common onboarding step for third-party platforms is a **delegation/authorization step** inside ARCA (granting the platform permission to act for your CUIT), plus configuring an **electronic point of sale**, as SiFactura describes. citeturn23view1

## Short recommendations for accounting studios vs small businesses

For **accounting studios (estudios contables)**, prioritize platforms that (a) support multi-client workflows, (b) minimize double entry, and (c) provide tax/accounting outputs (IVA books, regimes, reports) alongside e-invoicing. **Colppy** is particularly studio-forward (multi-user/roles, ARCA validation emphasis, tax calendar / IVA tooling, and a dedicated “software para estudios contables” value prop). citeturn11view2turn11view0turn12view0  
**Xubio’s Estudio plans** are strong when you want to centralize management and collaborate with clients already on Xubio, but its own pricing page cautions that studio plans **do not issue e‑invoices on behalf of clients**, which matters if your studio is expected to emit for customers. citeturn21search0turn21search1  
For studios building a “facturación service” or integrating issuance into in-house tools, **TusFacturasAPP API** is the most explicit about returning **CAE + QR** and offers many volume tiers in ARS; this can be attractive for multi-client automation where the studio controls the tech stack. citeturn29search1turn29search0

For **small businesses**, selection typically depends on how invoices are generated:
- If you want an all-in-one admin/accounting+invoicing suite with common Argentine integrations, **Xubio (Emprendedor/Empresa)** is a strong baseline, with clear free tiers and 14‑day trials for paid plans. citeturn21search3turn21search4turn20search0  
- If you want a plan-structured ERP where limits are explicit (comprobantes, SKUs, CUITs, users), **Contabilium** offers a transparent progression including a free plan and 10‑day trials. citeturn10view0turn10view1  
- If your main pain is **e‑commerce order-to-invoice automation**, **Facturante** is designed around integrations + batch issuance, with annual discounts and visible marketplace reviews. citeturn18view2turn17view0turn16view2  
- If you need **ARCA A/B/C with explicitly-stated CAE** plus POS/barcode workflows, **Cobalto** and **SistemaDeFacturacion.com.ar** are among the most explicit about CAE and ARCA homologation in their marketing. citeturn23view0turn25search0turn22search2

When you have to build custom flows (e.g., invoicing on payment confirmation, multi-branch/multi-CUIT orchestrations, or embedding invoicing in an existing system), choose an **API-first provider** (TusFacturasAPP API, Afip SDK, or FAEARG depending on budget and how much integration help you want). citeturn29search1turn29search11turn30search0
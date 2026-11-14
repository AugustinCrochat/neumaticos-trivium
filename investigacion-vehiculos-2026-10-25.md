# Investigación de vehículos y medidas compatibles (2026-10-25)

## Método
- Base propia: `src/lib/vehicles.ts` (373 modelos con medidas) vs `src/lib/vehiculos.json` del POS (438 modelos para el desplegable).
- Fuentes externas: catálogo vigente de Autocosmos (60 marcas, 422 modelos, medida por versión), comparador de Autocosmos (4 versiones por consulta), ficha técnica oficial de Hyundai (PDF), notas de Perfil/Autoweb/Monkeymotor, concesionarias.
- Límite: Autocosmos tiene errores de carga (p. ej. "195//R1655", "105/55 R16") y no es fuente oficial. Todo lo marcado "a confirmar" necesita una segunda fuente (etiqueta de la puerta, manual o ficha del fabricante) antes de cargarse.
- No se pudo consultar Mercado Libre, foros ni redes: el buscador no devolvió publicaciones útiles. Las fichas de concesionarias de Autocosmos y las notas de prensa fueron la fuente práctica.

## 1. Cobertura
- 294 de los 438 modelos del POS tienen medidas (67%). Faltan 144, casi todos autos viejos (R4, R9, R12, Fuego, Kadett, Chevette, Dodge 1500, Karmann Ghia, etc.).
- Modelos vigentes que **no están en `vehicles.ts` ni en el POS**:
  - Renault: Boreal, Arkana, Koleos, Megane E-Tech, Kwid E-Tech
  - Toyota: Yaris Cross, C-HR, bZ4X, GR86, Crown, Land Cruiser 300
  - Citroën: Basalt
  - Kia: K3, K3 Cross, K4, Seltos, Tasman, K2500
  - Hyundai: HB20 (hatch y sedán), Staria, Venue
  - Nissan: Kait
  - Chevrolet: Captiva PHEV, Silverado, Sonic, Spark EUV, Joy
  - Ford: Everest, E-Transit, Mustang Mach-E
  - BYD: Dolphin Mini, Seal U, Song Pro, Yuan Pro, Shark 6, King, Atto 3, Han
  - Chery: Arrizo 8, Tiggo 7 Pro, Tiggo 4 Hybrid, Omoda 5
  - Otros: Suzuki Fronx / S-Presso / S-Cross, MG 3 / 5 / Cyberster, Mitsubishi ASX / Eclipse Cross, Haval H7, GWM Ora / Poer, Jetour T1 / T2 / X50, JAC JS4 / JS6 / JS8 / T9 / X200, Geely Coolray / Icon / Emgrand X7, VW Touareg
- Marcas enteras sin cargar: Kaiyi, Maxus, Leapmotor, Lynk & Co, SWM, SsangYong/KGM, Tank, GAC, Iveco, Isuzu (están en el POS pero sin medidas), Maserati, Foton (Wonder), JMC (Grand Avenue Plus / Dadao), BAIC (EU5, U5 Plus, X55 Plus, BJ30, BJ60).

## 2. Medidas nuevas con respaldo (Autocosmos, a confirmar las marcadas *)
| Modelo | Versión | Medida |
|---|---|---|
| Toyota Yaris Cross | XLi | 215/60 R17 |
| Toyota Yaris Cross | XEi / SEG / XEi HEV / SEG HEV | 215/55 R18 (Perfil lo confirma) |
| Citroën Basalt | Live (acero) / Feel / Dark Edition* | 205/60 R16 |
| Citroën Basalt | Shine / First Edition | 215/60 R17 (*Dark Edition figura 205/60 R16, raro: comparte base con Shine) |
| Nissan Kait | Sense | 205/60 R16 (confirmado en concesionaria) |
| Nissan Kait | Advance | 205/55 R17 (confirmado en concesionaria) |
| Nissan Kait | Exclusive* | Autocosmos dice 205/60 R16, no verificado |
| Hyundai HB20 | Comfort Plus | 185/60 R15 (ficha oficial Hyundai) |
| Hyundai HB20 | Comfort Plus Aut / Platinum Safety Aut | 195/55 R16 (ficha oficial Hyundai) |
| Hyundai HB20 Sedán | Comfort Plus / Platinum | 185/60 R15 (*Platinum tendría 195/55 R16, a confirmar) |
| Kia Seltos | LX 1.6 Aut | 215/60 R17 |
| Kia K4 Sedán | EX / GT-Line | 225/45 R17 / 235/40 R18 |
| Kia K3 / K3 Cross | EX / GT-Line | 205/55 R17 |
| Kia Tasman | EX 2.5 / EX 2.2 | 265/65 R17 |
| Kia Tasman | X-Pro 2.5 | 265/70 R17 (All Terrain) |
| BYD Dolphin Mini | GL / GS | 185/55 R16 |
| BYD Song Pro | GL / GS | 225/60 R18 |
| BYD Yuan Pro | GL / GS | R17 (falta ancho/perfil)* |
| Renault Arkana E-Tech | Esprit Alpine | 215/55 R18 |
| Renault Boreal | Evolution / Techno 18", Iconic 19" | sin medida publicada* |
| Chevrolet Spark EUV | 102 cv | 215/55 R17 |
| Ford Territory | SEL / Titanium | 235/55 R18 / 235/50 R19 |
| Haval Jolion Pro HEV | Deluxe / Supreme | 215/60 R17 / 225/55 R18 |
| Haval H6 Pro HEV | Deluxe | 225/55 R19 |
| JAC JS4 / JS8 Pro | Flagship / 1.5T | 215/50 R17 / 235/50 R19 |
| Jetour T1 | 2.0T | 235/60 R19 |
| RAM 1500 | Laramie | 275/55 R20 (Night Edition 285/45 R22) |
| Foton Wonder | 1.6L | 175/70 R14 |

## 3. Posibles errores en datos existentes
| Modelo | Hoy en el sitio | Fuente externa | Acción propuesta |
|---|---|---|---|
| Renault Kwid Outsider (2022+) | 175/70 R14 | 165/70 R14 (Autocosmos + concesionarias; coincide con Iconic Bitono) | Corregir |
| Toyota Hilux 2015+ DX | 265/70 R16 | DX 4x2 cabina y chasis 225/70 R17; DX en general parecen R17 | Revisar por versión (DX/SR/SRV/SRX) |
| Toyota Hilux 2005-2015 base | 265/70 R16 | base 4x2 205/80 R16 (muchoneumatico, pero esa fuente usa trims que no existen en Argentina) | A confirmar |
| Fiat Argo Drive 1.3 (2023+) | 185/65 R15 | 185/60 R15 (igual que Cronos Like y Yaris) | A confirmar y corregir |
| Jeep Wrangler Rubicon (2024+) | 285/70 R17 | 255/75 R17 | A confirmar |
| JAC S2 | 195/60 R16 | 205/55 R16 | A confirmar |
| Chevrolet Onix LTZ gen 2 | 185/65 R15 / 195/55 R16 | Autocosmos dice 195/65 R16 (probable error de carga) | No tocar |
| Fiat Cronos Precision CVT | 195/55 R16 | Autocosmos solo trae "R16" | Sin cambio |

Coincidencias (sin cambios): Yaris (185/60 R15 y 195/50 R16), Cronos, Tracker, Onix Plus, Territory, Titano, Tera, Hilux SRV/SRX, Ranger.

## 4. Próximos pasos sugeridos
1. Cargar los modelos de la sección 2 con medidas verificadas (empezar por Yaris Cross, Basalt, Kait, HB20, Seltos, K4, Tasman, Dolphin Mini, Song Pro, Arkana, Boreal).
2. Corregir Kwid Outsider y revisar Hilux por versión.
3. Pedirle al taller que confirme con la etiqueta de la puerta los dudosos (Argo, Wrangler, JAC S2, Boreal, Kait Exclusive).
4. Agregar las marcas faltantes al POS (`vehiculos.json`) para que aparezcan en el desplegable; el nombre debe coincidir exacto con `vehicles.ts`.

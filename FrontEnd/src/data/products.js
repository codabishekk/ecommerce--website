import calgroImg from '../assets/product image/tablets3.png';
import ceramoisImg from '../assets/PRODUCT HOME IMAGE/lotion.png';
import glazziumImg from '../assets/PRODUCT HOME IMAGE/glazzium face wash.png';
import uvinorImg from '../assets/PRODUCT HOME IMAGE/Sunscreen2.png';
import sertafreeImg from '../assets/PRODUCT HOME IMAGE/Serta Free.png';
import acnevorCnImg from '../assets/PRODUCT HOME IMAGE/Acnevor CN.png';
import acnevorImg from '../assets/PRODUCT HOME IMAGE/Acnevor Gel.png';

// Secondary/Hover Images
import calgroHover from '../assets/product image/tablets2.png';
import ceramoisHover from '../assets/product image/skin care routine -1.png';
import glazziumHover from '../assets/product image/skin care routine -2.png';
import uvinorHover from '../assets/product image/Sunscreen.png';
import sertafreeHover from '../assets/product image/Serta Free.png';
import acnevorCnHover from '../assets/product image/Acnevor CN with Box.png';
import acnevorHover from '../assets/product image/Acnevor with box.png';

// Gallery Images - Calgro
import calgroGal1 from '../assets/product image/tablets1.png';
import calgroGal2 from '../assets/product image/tablets2.png';
import calgroGal3 from '../assets/product image/tablets3.png';
import calgroGal4 from '../assets/product image/tablets4.png';

// Gallery Images - Ceramois
import ceramoisGal1 from '../assets/PRODUCT HOME IMAGE/lotion.png';
import ceramoisGal2 from '../assets/product image/lotion with model-1.png';
import ceramoisGal3 from '../assets/product image/skin care routine -1.png';
import ceramoisGal4 from '../assets/product image/skin care routine -3.png';

// Gallery Images - Glazzium
import glazziumGal1 from '../assets/PRODUCT HOME IMAGE/glazzium face wash.png';
import glazziumGal2 from '../assets/product image/skin care routine -2.png';
import glazziumGal3 from '../assets/product image/skin care routine -4.png';
import glazziumGal4 from '../assets/product image/skin care routine -5.png';

// Gallery Images - Uvinor
import uvinorGal1 from '../assets/PRODUCT HOME IMAGE/Sunscreen2.png';
import uvinorGal2 from '../assets/product image/Sunscreen.png';
import uvinorGal3 from '../assets/product image/sunscreen with model-1.png';
import uvinorGal4 from '../assets/product image/skin care routine -6.png';

// Gallery Images - Sertafree
import sertafreeGal1 from '../assets/PRODUCT HOME IMAGE/Serta Free.png';
import sertafreeGal2 from '../assets/product image/Serta Free.png';
import sertafreeGal3 from '../assets/product image/skin care routine -1.png';
import sertafreeGal4 from '../assets/product image/skin care routine -3.png';

// Gallery Images - Acnevor CN
import acnevorCnGal1 from '../assets/PRODUCT HOME IMAGE/Acnevor CN.png';
import acnevorCnGal2 from '../assets/product image/Acnevor CN.png';
import acnevorCnGal3 from '../assets/product image/Acnevor CN with Box.png';
import acnevorCnGal4 from '../assets/product image/Acnevor CN -1.png';

// Gallery Images - Acnevor
import acnevorGal1 from '../assets/PRODUCT HOME IMAGE/Acnevor Gel.png';
import acnevorGal2 from '../assets/product image/Acnevor Gel.png';
import acnevorGal3 from '../assets/product image/Acnevor tube.png';
import acnevorGal4 from '../assets/product image/Acnevor with box.png';


export const products = [
    {
        id: 1,
        name: "Calgro™ – Nutraceutical Tablets",
        tagline: " Complete Nutritional Support for Stronger Bones, Better Energy, and Overall Wellness.",
        image: calgroImg,
        hoverImage: calgroHover,
        images: [calgroGal1, calgroGal2, calgroGal3, calgroGal4],
        description: "Calgro™ is a nutraceutical supplement formulated with vitamins, minerals, amino acids,and botanical extracts to support overall health and nutrition.",
        tar:"Vitamins, Minerals, Amino Acids With Isoflavones and Grape Seed Extract Tablets",
        category: "Protection",
        color: "#e6f2ed",
        price: 325.00,
        rating: 4.8,
        reviewsCount: 6,
        Target:["Target Consumer Group:For Adults (Moderate Men & Women)"],
        features: ["Supports bone strength and joint health", "Supports overall nutritional balance", "Helps maintain energy levels and metabolism", "Helps improve general wellness"],
        details: {
            benefits: [
                { id: 'hair-growth', title: 'Hair Growth', content: 'Calgro™ – Nutraceutical Tablets:\n• Vitamins\n\t◦ Boosts immunity and helps in antioxidant protection.\n\t◦ Support metabolism and energy production.\n\n• Minerals\n\t◦ Supports hair growth and strength\n\t◦ Improves scalp nourishment\n\t◦ Provides essential minerals for overall hair health\n\n• Amino Acid With Isoflavones and Grape Seed Extract Tablets\n\t◦ Grape seed extract helps protect hair with antioxidants\n\t◦ Improves hair thickness and volume.' },
                
            ],
            // ingredients: [
            //     { id: 'actives', title: 'Ingredients', content:'• Vitamins (C, B3, B5, B6, B2, Folic Acid)\n • Minerals (Calcium, Magnesium, Iron, Zinc, Copper, Manganese)\n\t• Amino acids\n\t•Soy Isoflavones\n\t•Grape Seed Extract\n\t•Green Tea Extract' },
            //     // { id: 'other', title: 'Other Ingredients', content:'• Binder (INS 1420 and 460(i))\n• Diluent (INS 341(ii))\n• Stabilizer (INS 1202)\n• Anti-caking Agent (INS 553(iii) and INS 470(iii))\n• Solvent for coating (MDC and IPA)\n• Class II Preservative (INS 219 and INS 216)\n• Contains Permitted Synthetic Food Colours.(INS 17).'},
            // ],
            ingredients: [
  {
    id: 'actives',
    title: 'Ingredients',
    content: `• Vitamins: Vitamin C – Boosts immunity, improves skin glow, strong antioxidant\n• Minerals: Muscle relaxation, better sleep, reduces stress\n• Amino Acids: Improve skin, hair, and nail strength\n• Soy Isoflavones: Supports hormonal balance (especially in women)\n• Grape Seed Extract: Improves skin glow & anti-aging\n• Green Tea Extract: Improves skin health and reduces acne`
  }
],
            'before-after': [
                { id: 'Before ', title: 'Before Use', content: '• Excessive hair fall and breakage\n• Weak hair follicles and poor scalp nutrition\n• Thin, lifeless hair with low volume\n• Slow or uneven hair growth\n• Dull, unhealthy-looking hair' },
                {id: 'After', title:'After Use', content:'•Noticeable reduction in hair fall\n• Stronger, healthier hair follicles\n• Thicker, fuller hair with improved volume\n• Enhanced hair growth cycle\n•Healthier, shinier, and more resilient hair'},
            ],
            usage: [
                { id: 'apply', title: 'How to Use', content: '• Take 1 tablet twice daily\n• Consume after breakfast and dinner\n• Swallow with a glass of water\n• Use daily for best hair growth results\n• Follow the recommended dosage ' },
            ],
            faq: [
                { id: 'white-cast', title: 'Does it leave a white cast?', content: 'No, the ultra-sheer formula blends seamlessly into all skin tones.' }
            ],
            other: [
                { id: 'other information', title: 'Dosage', content: 'One tablet daily or directed bu the Health Practitioner.\n\n•KEEP OUT F REACH OF CHILDREN' },
                // { id: 'storage', title:'Storage', content: '• Store below 25°C,\n• A cool & dry place\n• Protect from direct light\n• heart & moisture'},
                
            ],
            legal: [
                { id: 'mfg', title: 'Manufacturer', content: 'Sholash Life Science Pvt. Ltd.' }
            ]
        }
    },
    {
        id: 2,
        name: "Ceramois™ – Ultra Nourishing Moisturizing Lotion 250ml",
        tagline: "Deep Hydration. Stronger Skin Barrier. All-Day Moisture.",
        image: ceramoisImg,
        hoverImage: ceramoisHover,
        images: [ceramoisGal1, ceramoisGal2, ceramoisGal3, ceramoisGal4],
        description: "Ceramoiz 250ml is a dermatologically tested moisturizing lotion enriched with Ceramide AO Complex, shea butter, mango butter, and olive oil. It provides  supports skin barrier repair, and is suitable for dry and sensitive skin.Ceramoiz lotion this moisturizing lotion helps improve the health of dry skin. It helps prevent & protect dry skin for full 24 hours.eramois lotion this moisturizing lotion helps improve the health of dry skin. It helps prevent & protect dry skin for full 24 hours.",
        tar:"Ultra Nourishing Moisturizing Lotion Strengthens the skin barrier \n\t Ceramides + Hyaluronic Acid + Sheabutter",
        futch:"Invisible Hydration" +"\n\t" + "Normal to dry sensitive skin" +"\n\n"+"Formulated With"+"\n\t"+"Dermatologically Tested Actives",
        precautions:"Avoid contact with eyes. If irritation occurs, rinse thoroughly with water.",
        category: "Moisturizer",
        color: "#f5eceb",
        price: 690.00,
        rating: 4.9,
        reviewsCount: 6,
        features: ["Ceramide Enriched", "24h Hydration", "Fragrance Free", "Deep Nourishment"],
        details: {
            benefits: [
                { id: 'barrier', title: 'Key Benefits', content: '\t•Provides deep and long-lasting hydration for dry skin \n\t• Improves skin texture for smoother, softer skin \n\t• Strengthens the skin’s natural barrier \n\t• Nourishes and restores dry, dull skin \n\t• Leaves skin healthy, supple, and well-moisturized' },
                
            ],
            ingredients: [
                { id: 'ceramides', title: 'Ingredients', content: '• Aqua: Acts as a base solvent for all ingredients\n• Jelly: Forms a protective barrier on skin\n• Glycerin: Powerful humectant (pulls moisture into skin)\n• Shea Butter: Rich in vitamins A & E\n• Emulsifying Wax: Improves product consistency and absorption' },
            //     { id: 'ceramides', title: 'Other Ingredients', content:'\n\t•Almond Oil\n\t•Bees Wax\n\t•Ceto Stearyl Alcohol\n\t•YUZU Ceramind B (Butylene Glycol (and) Water (and)\n\t•Citrus Junos Fruit Extract)\n\t•Dimethicone\n\t•Phenoxyethanol and Ethylhexylglycerin\n\t•Cerbomer\n\t•Triethanolamine\n\t•GMS SE\n\t•Niacinamide\n\t•Betaine\n\t•Hyaluronic Acid\n\t•Aloe vera Juice\n\t•Jojoba Oil\n\t•Vit\n\t•E Acerate\n\t•ESTA\n\t•Fragrance'}
            // 
            ],
            'before-after': [
                { id: 'dryness', title: 'Before Use', content: '\t•Dry and rough skin texture\n\t•Lack of moisture and dull appearance\n\t•Weak skin barrier\n\t•Tight and uncomfortable skin\n\t•Visible dryness and flakiness ' },
                {id: 'dryness1', title: 'After Use', content:'\t• Deeply hydrated and moisturized skin\n\t•Smoother and softer skin texture\n\t•Strengthened skin barrier\n\t•Healthy, nourished skin feel\n\t•Radiant and well-balanced skin'},
            ],
            usage: [
                { id: 'daily', title: 'Usage', content: '\t•Apply a small amount of lotion to clean, dry skin\n\t•Gently massage until fully absorbed\n\t•Use twice daily (morning and night) for best results\n\t•Apply on dry or rough areas for extra hydration\n\t•Use regularly to maintain soft, healthy skin' }
            ],
            faq: [
                { id: 'face-body', title: 'Can I use it on my face?', content: 'Yes, it is non-comedogenic and safe for both face and body.' }
            ],
            other: [
                { id: 'texture', title: 'Storage', content: 'Stroe in a cool and dry place below 30°C.\n\t•It is mandatory to perform a patch test before applying this product.\n\t•Do not use on cracked skin or open wounds.\n\t•In  case any irritation occurs stop the use of product with immediate effect and consult your dermatologist.\n\t•KEEP OUT OF REACH OF CHILDREN. ' }
            ],
            legal: [
                { id: 'reg', title: 'Regulatory', content: 'Complaint with cosmetic standards.' }
            ]
        }
    },
    {
        id: 3,
        name: "Glazzium™ – Anti-Acne Detoxifying Face Wash 100ml",
        tagline: " Deep Clean. Oil Control. Clear & Healthy Skin.",
        image: glazziumImg,
        hoverImage: glazziumHover,
        images: [glazziumGal1, glazziumGal2, glazziumGal3, glazziumGal4],
        description: "Glazzium face wash is a gently exfoliating and enriched with natural extracs that reach deep into your skins blocked pores to remove trapped oil, toxins, dead skin and acne. Moisture is locked in, Make your skin cleansed, nourished and toned. ",
        tar:"Removes excess oil,  Relieves impurities, Imparts a healthy glow , Gentle for everday use",
        futch:"Paraben Free , Light & Non Greasy, Non Comedogenic",
         precautions:"Avoid contact with eyes. If Irritation occurs, rinse thoroughly with water.",
        category: "Cleanser",
        color: "#e8f0f2",
        price: 392.00,
        rating: 4.7,
        reviewsCount: 6,
        features: ["Detoxifying Action", "Oil Control", "Gentle Cleansing", "Anti-acne Properties"],
        details: {
            benefits: [
                { id: 'detox', title: 'Benefits', content: '•   Helps reduce pimples and breakouts with active ingredients like Salicylic Acid, Tea Tree & Neem.\n•   Removes dirt, oil, and impurities from pores for a fresh, clear, and healthy-looking skin.\n•   Enriched with Glycerin, Aloe Vera & Pentavitin to keep skin soft and moisturized.\n•   Calms irritation and redness with Allantoin & Calendula while maintaining skin balance.' },
                // { id: 'acne-prevention', title: 'Prevents Breakouts', content: 'Salicylic acid helps clear pores and reduce acne-causing bacteria.' }
            ],
            ingredients: [
                { id: 'salicylic', title: 'Ingredients', content: '• Sodium lauryl ether sulfate: Creates rich foam for deep cleaning\n• Acrylate copolymer: Improves spreadability on skin\n• Salicylic acid: Unclogs pores and removes dead skin cells\n• Triethanolamine D-panthanol: Helps balance pH level of the product' }
            ],
            'before-after': [
                { id: 'oil', title: 'Before Use', content: '•Excess oil buildup with greasy, shiny skin\n•Frequent acne breakouts and clogged pores\n•Dull, uneven skin tone with rough texture\n•Redness, irritation, and sensitive skin feel' },
                {id:'oil', title:'After Use', content:'•Oil-free, fresh, and deeply cleansed skin\n•Reduced acne, clearer pores, and smoother texture\n•Brighter, more even, and healthy-looking skin\n•Calm, soothed, and well-balanced skin'}
            ],
            usage: [
                { id: 'wash', title: 'Washing Instructions', content: '•Take small amount of face wash on your palm\n• Massage gently\n•Rinse well and pat dry\n•Use it twice daily for best Results.' }
            ],
            faq: [
                { id: 'drying', title: 'Will it dry out my skin?', content: 'No, it contains soothing agents to maintain skin moisture balance.' }
            ],
            other: [
                { id: 'type', title: 'Other Informations', content: '•  Store in a cool and dry place below 30°C.\n•  It is mandatory to perform a patch test before applying this product.\n•  Do not use on cracked skin or open wounds.\n•  In case any irritation occurs stop the use of product with immediate effect and consult your dermatologist.\n•  Place cap tightly after use.\n•  Keep out of reach of children.' }
            ],
            legal: [
                { id: 'safety', title: 'Safety Info', content: 'Dermatologically tested.' }
            ]
        }
    },
    {
        id: 4,
        name: "Uvinor™ – Clear Radiance Skin Brightening Sunscreen SPF 50+ 50ml",
        tagline: "Powerful Sun Protection with Hydration and Skin Brightening.",
        image: uvinorImg,
        hoverImage: uvinorHover,
        images: [uvinorGal1, uvinorGal2, uvinorGal3, uvinorGal4],
        description: "Uvinor is a sunscreen product designed to protect the skin from harmful UVA and UVB rays. It helps prevent sunburn, premature aging, and reduces the risk of skin cancer. Uvinor typically contains broad-spectrum UV filters, antioxidants, and moisturizing ingredients to maintain skin health while offering sun protection. SPF 50+ helps protect sensitive skin from UV induced damage and also acts as a mositrurizer.  This sunblock offers broad spectrum protection against the sun's damaging rays. Safe on young delicate skin of children. ",
        tar:"Fortified with Niacinamide, Chamomile and Hyaclear 7,  Formulated with Dermatologically Tested Actives.",
        category: "Treatment",
        color: "#f0f0f0",
        price: 498.00,
        rating: 4.6,
        reviewsCount: 6,
        features: ["Clinical Grade", "Pore Minimizing", "Sebum Control", "Fast Acting"],
        details: {
            benefits: [
                { id: 'dual-action', title: 'Dual Action', content: '• Shields skin from harmful UVA & UVB rays, preventing sunburn and tanning.\n•  Enhances natural glow and helps reduce dullness for a radiant look\n•  Absorbs quickly without white cast or sticky feel—perfect for daily use\n•  Helps protect against dark spots, pigmentation, and premature aging'},
                // { id: 'pores', title: 'Pore Refinement', content: 'Reduces the appearance of enlarged pores over time.' }
            ],
            ingredients: [
                { id: 'formulas', title: 'Ingredients', content: '• Carbomer: Improves product consistency & thickness\n• Cocont oil: Deeply nourishes and moisturizes skin\n• Vanilla extract: Supports skin rejuvenation\n• Green tea extract: Rich in antioxidants' }
            ],
            'before-after': [
                { id: 'acne-reduction', title: 'Before Use', content: '• Skin exposed to harmful UV rays and sun damage\n• Dull, tanned, and uneven skin tone\n• Risk of dark spots and pigmentation\n• Dry, unprotected skin prone to premature aging' },
                {id: 'acne-reduction', title: 'After Use', content:'• Strong protection against UVA & UVB rays\n• Brighter, more even, and radiant skin tone\n• Reduced tanning, dark spots, and pigmentation\n• Hydrated, smooth, and healthy-looking skin'}
            ],
            usage: [
                { id: 'night', title: 'Night Application', content: '• Start with a clean, dry face before application.\n• ake an adequate amount and spread evenly on face & neck\n• Apply at least 15–20 minutes before going outdoors\n• Reapply every 2–3 hours or after sweating/washing for continuous protection' }
            ],
            faq: [
                { id: 'purging', title: 'Will I experience purging?', content: 'Some initial breakouts may occur as the skin adjusts to the retinoid.' }
            ],
            other: [
                { id: 'sun-sensitivity', title: 'Sun Sensitivity', content: '•  Store in a cool and dry place below 30°C.\n•  It is mandatory to perform a patch test before applying this product.\n•  Do not use on cracked skin or open wounds.\n•  In case any irritation occurs stop the use of product with immediate effect and consult your dermatologist.\n•  Place cap tightly after use.\n•  Keep out of reach of children.' }
            ],
            legal: [
                { id: 'rx', title: 'Prescription', content: 'Use as directed by a healthcare professional.' }
            ]
        }
    },
    {
        id: 5,
        name: "SertaFree™ – Sertaconazole Nitrate Cream 20mg",
        tagline: " Effective Relief from Fungal Skin Infections",
        image: sertafreeImg,
        hoverImage: sertafreeHover,
        images: [sertafreeGal1, sertafreeGal2, sertafreeGal3, sertafreeGal4],
        description: "Broad-spectrum antifungal cream with Sertaconazole Nitrate,Effectively treats fungal infections like ringworm, athlete’s foot & jock itch,Provides quick relief from itching, redness, and irritation,Smooth, non-greasy formula suitable for daily application.",
        tar:"Avoid contact with eyes, mouth and open wounds. If contact occurs, wash thoroughy with water. Keep the medicine out of reach of children.",
        category: "Treatment",
        color: "#ebf2f5",
        price: 232.00,
        rating: 4.8,
        reviewsCount: 6,
        features: ["Anti-inflammatory", "Texture Improvement", "Soothing Effect", "Dermatological Solution"],
        details: {
            benefits: [
                { id: 'inflammation', title: ' Benefits', content: '• Eliminates Fungal Infection at Source\n• Relieves Itching, Burning & Redness\n• Prevents Recurrence of Infection\n• Promotes Faster Skin Healing' },
            //     { id: 'texture', title: 'Texture Smoothing', content: 'Improves the overall smoothness and clarity of the skin.' }
            //
             ],
            ingredients: [
                { id: 'cn-actives', title: 'Ingredients', content: '• Sertaconazole Nitrate: Powerful antifungal agent\n• Cream Base: Ensures smooth and even application\n• Moisturizing Agents: Prevent dryness and irritation\n• Stabilizers & Preservatives: Maintain product safety and effectiveness' },
           ],
            'before-after': [
                { id: 'redness', title: 'Before Use', content: '• Fungal infection with itching and discomfort\n• Red, inflamed, or scaly skin patches \n• Burning sensation and skin irritation \n• Spreading or recurring infection areas ' },
                { id: 'redness', title: 'After Use', content: '• Relief from itching, burning, and irritation \n• Reduced redness and clearer skin \n• Controlled and eliminated fungal infection \n• Healthy, smooth, and restored skin' }

            ],
            usage: [
                { id: 'spot-treat', title: 'Usage', content: '• Clean and dry the affected area thoroughly\n• Apply a thin layer to the affected skin\n• Use once or twice daily as directed\n• Continue usage for the full prescribed duration' }
            ],
            faq: [
                { id: 'moisturizer', title: 'Can I use moisturizer?', content: 'Yes, apply after the gel has completely absorbed.' }
            ],
            other: [
                { id: 'storage-temp', title: 'Other Information', content: '• Keep the cap tightly closed after use.\n• Keep out of reach of children.' }
            ],
            legal: [
                { id: 'mfg-info', title: 'Manufacturing', content: 'Certified GMP facility.' }
            ]
        }
    },
    {
        id: 6,
        name: "Acnevor CN™ – Clindamycin Phosphate & Nicotinamide Gel 20mg",
        tagline: " Targeted Treatment for Acne & Skin Inflammation.",
        image: acnevorCnImg,
        hoverImage: acnevorCnHover,
        images: [acnevorCnGal1, acnevorCnGal2, acnevorCnGal3, acnevorCnGal4],
        description: "Advanced anti-acne gel with Clindamycin & Nicotinamide,Targets acne-causing bacteria and reduces inflammationLightweight, non-greasy formula for quick absorption,Ideal for oily and acne-prone skin.",
        precautions:"Product from direct sunlight,  Avoid contact with eyes.",
        category: "Special Care",
        color: "#f2f5e9",
        price: 186.00,
        rating: 4.9,
        reviewsCount: 6,
        features: ["Fast Relief", "Skin Restoration", "Intensive Care", "Safe for Sensitive Skin"],
        details: {
            benefits: [
                { id: 'antifungal', title: 'Benefitsn', content: '• Reduces Acne & Breakouts Effectively\n• Controls Oil & Prevents Clogged Pores\n• Soothes Redness & Skin Irritation\n• Improves Skin Clarity & Texture' },
                // { id: 'relief', title: 'Itching Relief', content: 'Provides rapid relief from itching, burning, and irritation.' }
            ],
            ingredients: [
                { id: 'serta', title: 'Key Ingredients', content: '• Clindamycin: Fights acne-causing bacteria\n• Nicotinamide (Vitamin B3): Reduces inflammation & brightens skin\n• Gel Base: Lightweight and fast-absorbing\n• Stabilizing Agents: Maintain product effectiveness' }
            ],
            'before-after': [
                { id: 'infection-clear', title: 'Before Use', content: '• Active acne, pimples, and breakouts\n• Oily skin with clogged pores\n• Redness, irritation, and inflammation\n• Uneven and rough skin texture' },
                { id: 'cream-apply', title: 'After Use', content: '• Reduced acne and clearer skin\n• Balanced oil and cleaner pores\n• Calm, soothed, and less irritated skin\n• Smoother and more even skin texture' }

            ],
            usage: [
                { id: 'cream-apply', title: 'Usage', content: '• Cleanse and dry your face properly\n• Apply a thin layer to affected areas\n• Use once or twice daily as directed\n• Avoid eye area and use sunscreen during the day' },
                
            ],
            faq: [
                { id: 'contagious', title: 'Is it contagious?', content: 'Fungal infections can be contagious; maintain good hygiene during treatment.' }
            ],
            other: [
                { id: 'duration', title: 'Other Information', content: '• Keep the cap tightly closed after use.\n• Keep out of reach of children.' }
            ],
            legal: [
                { id: 'schedule', title: 'Schedule', content: 'Schedule H Drug.' }
            ]
        }
    },
    {
        id: 7,
        name: "Acnevor™ – Adapalene & Clindamycin Phosphate Gel 20gm",
        tagline: "Advanced Dual Action Acne Therapy",
        image: acnevorImg,
        hoverImage: acnevorHover,
        images: [acnevorGal1, acnevorGal2, acnevorGal3, acnevorGal4],
        description: "Advanced acne treatment gel combining Adapalene (retinoid) & Clindamycin (antibiotic). Targets acne at the root by unclogging pores and fighting acne-causing bacteria. Lightweight, fast-absorbing formula for effective daily treatment. Suitable for oily, acne-prone, and combination skin",
        precautions:"Product from direct sunlight,  Avoid contact with eyes. ",

        category: "Nutraceutical",
        color: "#f5f0e6",
        price: 255.00,
        rating: 4.5,
        reviewsCount: 6,
        features: ["Internal Nutrition", "Hair & Skin Health", "Vitamins & Minerals", "Complete Daily Supplement"],
        details: {
            benefits: [
                { id: 'uv-protection', title: 'Benefits', content: '• Reduces Acne & Pimples \n• Unclogs Pores & Prevents Breakouts\n• Controls Bacteria & Inflammation\n• Improves Skin Texture & Clarity' },
                // { id: 'skin-health', title: 'Skin Radiance', content: 'Antioxidants protect skin from internal stress and improve glow.' }
            ],
            ingredients: [
                { id: 'vits', title: 'Ingredients', content: '• Adapalene: Promotes skin renewal & prevents clogged pores\n• Clindamycin Phosphate: Fights acne-causing bacteria \n• Gel Base: Lightweight, non-greasy formulation \n• Stabilizing Agents: Ensure effectiveness & safety' }
            ],
            'before-after': [
                { id: 'hair-fall', title: 'Before Use', content: '• Active acne, pimples, and inflamed skin\n• Clogged pores with blackheads/whiteheads\n• Oily skin with frequent breakouts\n• Uneven, rough skin texture' },
                { id: 'hair-fall', title: 'After Use', content: '• Reduced acne and clearer skin\n• Clean, unclogged pores\n• Balanced oil production\n• Smoother, healthier skin texture' }

            ],
            usage: [
                { id: 'tablet', title: 'Dosage', content: '• Cleanse and dry your face thoroughly\n• Apply a thin layer to affected areas (preferably at night)\n• Avoid eyes, lips, and sensitive areas\n• Use regularly as advised; apply sunscreen during daytime' }
            ],
            faq: [
                { id: 'ayurvedic', title: 'Is it ayurvedic?', content: 'It is a scientifically formulated nutraceutical supplement.' }
            ],
            other: [
                { id: 'vegetarian', title: 'Other Information', content: '• Protect from direct sunlight Avoid contact with eyes.\n•  Keep out of reach of children.\n• Keep the cap tightly closed after Use' }
            ],
            legal: [
                { id: 'fssai', title: 'FSSAI Approved', content: 'Certified as a safe dietary supplement.' }
            ]
        }
    }
];

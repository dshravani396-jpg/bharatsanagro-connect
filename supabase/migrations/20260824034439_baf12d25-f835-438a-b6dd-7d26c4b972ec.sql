
CREATE TYPE public.app_role AS ENUM ('farmer','store');
CREATE TYPE public.booking_status AS ENUM ('pending','confirmed','ready','collected','cancelled');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  mobile text NOT NULL DEFAULT '',
  email text,
  state text,
  district text,
  village text,
  photo_url text,
  language text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own roles insert" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  store_name text NOT NULL,
  owner_name text NOT NULL DEFAULT '',
  mobile text NOT NULL DEFAULT '',
  email text,
  state text,
  district text,
  address text,
  pincode text,
  gst_number text,
  license_details text,
  opening_hours text DEFAULT '9:00 AM - 7:00 PM',
  image_url text,
  description text,
  rating numeric(2,1) NOT NULL DEFAULT 4.5,
  is_open boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.stores TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stores TO authenticated;
GRANT ALL ON public.stores TO service_role;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stores public read" ON public.stores FOR SELECT USING (true);
CREATE POLICY "own store insert" ON public.stores FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "own store update" ON public.stores FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "own store delete" ON public.stores FOR DELETE TO authenticated USING (auth.uid() = owner_id);

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name text NOT NULL,
  brand text,
  category text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 0,
  unit text DEFAULT 'unit',
  mfg_date date,
  expiry_date date,
  description text,
  image_url text,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT USING (true);
CREATE POLICY "store owner manage products" ON public.products FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.stores s WHERE s.id = products.store_id AND s.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.stores s WHERE s.id = products.store_id AND s.owner_id = auth.uid()));

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code text NOT NULL UNIQUE DEFAULT ('BSA-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  farmer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farmer_name text NOT NULL DEFAULT '',
  farmer_mobile text NOT NULL DEFAULT '',
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  product_name text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 1,
  total_price numeric(10,2) NOT NULL DEFAULT 0,
  status public.booking_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "farmer reads own bookings" ON public.bookings FOR SELECT TO authenticated USING (auth.uid() = farmer_id);
CREATE POLICY "store reads its bookings" ON public.bookings FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.stores s WHERE s.id = bookings.store_id AND s.owner_id = auth.uid()));
CREATE POLICY "farmer creates own bookings" ON public.bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "farmer updates own bookings" ON public.bookings FOR UPDATE TO authenticated USING (auth.uid() = farmer_id) WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "store updates its bookings" ON public.bookings FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.stores s WHERE s.id = bookings.store_id AND s.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.stores s WHERE s.id = bookings.store_id AND s.owner_id = auth.uid()));

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL DEFAULT '',
  rating integer NOT NULL DEFAULT 5,
  category text NOT NULL DEFAULT 'website_usability',
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews public read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "own review insert" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own review update" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own review delete" ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER t_profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER t_stores_touch BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER t_products_touch BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER t_bookings_touch BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.stores (id, store_name, owner_name, mobile, email, state, district, address, pincode, opening_hours, description, rating) VALUES
('11111111-1111-1111-1111-111111111111','Shree Krishna Agro Center','Ramesh Patil','9876543210','krishna.agro@example.com','Maharashtra','Pune','Main Market Road, Baramati','413102','8:00 AM - 8:00 PM','Trusted agro store serving farmers of Baramati since 1998.',4.7),
('22222222-2222-2222-2222-222222222222','Jai Kisan Krushi Seva Kendra','Sunil Deshmukh','9823456789','jaikisan@example.com','Maharashtra','Nashik','Near Bus Stand, Niphad','422303','9:00 AM - 7:00 PM','Seeds, fertilizers and irrigation products for grape and onion growers.',4.5),
('33333333-3333-3333-3333-333333333333','Bharat Agri Mart','Anil Yadav','9812345678','bharatagri@example.com','Madhya Pradesh','Indore','Krishi Mandi Road, Sanwer','453551','8:30 AM - 7:30 PM','Complete crop protection and equipment solutions.',4.3);

INSERT INTO public.products (store_id, name, brand, category, price, quantity, unit, mfg_date, expiry_date, description) VALUES
('11111111-1111-1111-1111-111111111111','Hybrid Bajra Seeds','Mahabeej','seeds',540,120,'kg','2026-03-01','2027-03-01','High yielding drought tolerant bajra hybrid seed.'),
('11111111-1111-1111-1111-111111111111','Urea 46% Nitrogen','IFFCO','fertilizers',290,300,'bag','2026-05-10','2028-05-10','Nitrogen fertilizer for healthy vegetative growth.'),
('11111111-1111-1111-1111-111111111111','Drip Irrigation Lateral Pipe','Jain Irrigation','irrigation',1850,45,'roll','2026-01-15',NULL,'16mm lateral pipe with inline drippers, 400m roll.'),
('22222222-2222-2222-2222-222222222222','Onion Seeds N-53','Nashik Seeds','seeds',720,80,'kg','2026-02-20','2027-02-20','Popular kharif onion variety with good storage life.'),
('22222222-2222-2222-2222-222222222222','Imidacloprid 17.8% SL','Bayer','pesticides',430,150,'litre','2026-04-05','2028-04-05','Systemic insecticide effective against sucking pests.'),
('22222222-2222-2222-2222-222222222222','Battery Sprayer 16L','Kisankraft','equipment',2650,25,'unit','2026-06-01',NULL,'Rechargeable knapsack sprayer with adjustable nozzle.'),
('33333333-3333-3333-3333-333333333333','Neem Oil Bio Pesticide','Krishi Rasayan','crop_protection',360,90,'litre','2026-03-18','2028-03-18','Organic crop protection for a wide range of pests.'),
('33333333-3333-3333-3333-333333333333','DAP Fertilizer','Coromandel','fertilizers',1350,200,'bag','2026-04-22','2029-04-22','Phosphorus rich fertilizer for strong root development.'),
('33333333-3333-3333-3333-333333333333','Power Weeder 5HP','VST Shakti','equipment',48500,6,'unit','2026-02-11',NULL,'Compact diesel power weeder for inter-cultivation.'),
('33333333-3333-3333-3333-333333333333','Mulching Paper 25 Micron','Garware','other',2100,40,'roll','2026-01-30',NULL,'Silver-black mulch film for moisture conservation.');

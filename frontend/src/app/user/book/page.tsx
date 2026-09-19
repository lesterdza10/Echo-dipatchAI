"use client";
import React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  CarFront,
  CircleGauge,
  Truck,
  Trash2,
  CheckCircle,
  Phone,
  LocateFixed,
  MapPin,
  ChevronRight,
  Navigation,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { vehicleType } from "@/models/vehicle.model";
import axiosClient from "@/lib/axiosClient";
import axios from "axios";

const stepVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 16 },
};

const VEHICLES = [
  {
    id: "compactor",
    label: "Compactor",
    icon: Trash2,
    desc: "Best for compact waste and small collection jobs",
  },
  {
    id: "pickup",
    label: "Pickup",
    icon: CarFront,
    desc: "Good for small to medium loads and quick trips",
  },
  {
    id: "mini-truck",
    label: "Mini Truck",
    icon: CircleGauge,
    desc: "Spacious cargo area for larger deliveries",
  },
  {
    id: "dump-truck",
    label: "Truck",
    icon: Truck,
    desc: "Heavy-duty vehicle for large shipments",
  },
];

type Place = {
  id: string;
  name: string;
  street: string;
  city?: string;
  state?: string;
  country?: string;
  countrycode?: string;
  postcode?: string;
  lat: number;
  lon: number;
};

function page() {
  const router = useRouter();
  const [vehicle, setVehicle] = React.useState<vehicleType | null>(null);
  const [mobile, setMobile] = React.useState("");
  const [pickup, setPickup] = React.useState("");
  const [drop, setDrop] = React.useState("");
  const [pickupCountry, setPickupCountry] = React.useState("");
  const [pickupLat, setPickupLat] = React.useState<Number>();
  const [pickupLon, setPickupLon] = React.useState<Number>();
  const [dropCountry, setDropCountry] = React.useState("");
  const [dropLat, setDropLat] = React.useState<Number>();
  const [dropLon, setDropLon] = React.useState<Number>();
  const [locating, setLocating] = React.useState(false);
  const [pickupSuggestions, setPickupSuggestions] = React.useState<Place[]>([]);
  const [dropSuggestions, setDropSuggestions] = React.useState<Place[]>([]);
  const canContinue = !!(
    vehicle &&
    mobile &&
    pickup &&
    drop &&
    pickupCountry &&
    dropCountry &&
    pickupLat &&
    pickupLon &&
    dropLat &&
    dropLon
  );
  //const [date, setDate] = React.useState("");
  // [time, setTime] = React.useState("");

  const progess = [!!vehicle, !!(mobile.length == 10), !!pickup, !!drop].filter(
    Boolean,
  ).length;

  const searchAddress = async (
    q: string,
    setResults: (r: Place[]) => void,
    restrict?: string | null,
  ) => {
    try {
      if (!q || q.trim().length < 3) {
        setResults([]);
        return;
      }
      const { data } = await axios.get(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(q.trim())}&limit=8&lang=en`,
      );
      console.log(data);
      let results: Place[] = (data.features ?? []).map((f: any) => ({
        id: String(f.properties?.osm_id || ""),
        name: f.properties?.name || "",
        street: f.properties?.street || "",
        city: f.properties?.city || "",
        state: f.properties?.state || "",
        country: f.properties?.country || "",
        countrycode: f.properties?.countrycode || "",
        postcode: f.properties?.postcode || "",
        lat: f.geometry?.coordinates[1] || 0,
        lon: f.geometry?.coordinates[0] || 0,
      }));
      if (restrict) {
        results = results.filter((r) => r.country === restrict);
      }

      setResults(results);
    } catch (error) {
      console.log(error);
      setResults([]);
    }
  };
  const suggestion = (p: Place) =>
    [p.name, p.street, p.city, p.state, p.country, p.postcode]
      .filter(Boolean)
      .join(", ");
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const { data } = await axios.get(
          `https://photon.komoot.io/reverse?lon=${coords.longitude}&lat=${coords.latitude}`,
        );

        if (data.features.length) {
          const p = data.features[0].properties;
          const address = [p.name, p.street, p.city, p.state, p.country]
            .filter(Boolean)
            .join(", ");
          setPickup(address);
          setPickupCountry(p.country);
          setPickupLat(coords.latitude);
          setPickupLon(coords.longitude);
          setPickupSuggestions([]);
          setLocating(false);
        }
      } catch (error) {
        console.log(error);
        setLocating(false);
      }
    });
  };
  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-4 mb-6 px-1">
          <motion.button
            whileTap={{ scale: 0.88 }}
            className="w-11 h-11 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center
          justify-center hover:bg-zinc-50 transition-colors shrink-0"
            onClick={() => router.push("/")}
          >
            <ArrowLeft size={20} className="text-zinc-900" />
          </motion.button>
          <div className="flex-1 min-w-0">
            <h1 className="text-zinc-900 text-xl font-black tracking-tight">
              Book a Vehicle
            </h1>
            <p className="text-zinc-400 text-xs mt-0.5">
              Fill out the form below to book a vehicle.
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {[0, 1, 2, 3].map((d, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i < progess ? 20 : 8,
                  background: i < progess ? "#09090b" : "#d4d4d8",
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full"
              />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-visible">
          <div className="h-1 bg-zinc-900 w-[90%] m-auto" />
          <div className="p-6 space-y-7">
            <motion.div
              variants={stepVariants}
              initial={"hidden"}
              animate={"visible"}
              transition={{ duration: 0.05 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center
                  shrink-0"
                >
                  <span className="text-[9px] font-black text-white">1</span>
                </div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Choose a Vehicle
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {VEHICLES.map((v, i) => {
                  const active = vehicle === v.id;
                  return (
                    <motion.div
                      key={v.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.07 + i * 0.05 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setVehicle(v.id as vehicleType)}
                      className={`relative p-3.5 rounded-2xl border flex items-center gap-3
                    text-left transition-all duration-200 ${
                      active
                        ? "bg-zinc-900 border-zinc-900 shadow-lg"
                        : "bg-zinc-50 border-zinc-200 hover:border-zinc-400"
                    }`}
                    >
                      <div
                        className={`
                        w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                        transition-colors ${
                          active ? "bg-white" : "bg-zinc-200"
                        }`}
                      >
                        <v.icon
                          size={20}
                          className={
                            active ? "text-white-900" : "text-zinc-600"
                          }
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-bold truncate ${
                            active ? "text-white" : "text-zinc-900"
                          }`}
                        >
                          {v.label}
                        </p>
                        <p
                          className={`text-[10px] truncate ${
                            active ? "text-zinc-400" : "text-zinc-400"
                          }`}
                        >
                          {v.desc}
                        </p>
                      </div>

                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2.5 right-2.5"
                      >
                        <CheckCircle
                          size={18}
                          className="text-white fill-white/20"
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
            <div className="h-px bg-zinc-200" />
            <motion.div
              variants={stepVariants}
              initial={"hidden"}
              animate={"visible"}
              transition={{ duration: 0.05 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center
                  shrink-0"
                >
                  <span className="text-[9px] font-black text-white">2</span>
                </div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Mobile Number
                </p>
              </div>

              <div
                className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3
              focus-within:border-zinc-900 focus-within:bg-white transition-all"
              >
                <div
                  className="w-8 h-8 rounded-xl bg-zinc-200 flex items-center justify-center
                shrink-0"
                >
                  <Phone size={18} className="text-zinc-800" />
                </div>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  inputMode="numeric"
                  maxLength={13}
                  className="flex-1 bg-transparent text-sm font-semibold text-zinc-900
                placeholder:text-zinc-400 outline-none"
                  placeholder="Enter your mobile number"
                />
                <AnimatePresence>
                  {mobile.length === 10 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <CheckCircle
                        size={16}
                        className="text-emerald-500 fill-emerald-50 shrink-0"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <p className="text-[10px] text-zinc-400 mt-1.5 ml-1">
                Vehicle updates will be sent to this number
              </p>
            </motion.div>
            <div className="h-px bg-zinc-200" />
            <motion.div
              variants={stepVariants}
              initial={"hidden"}
              animate={"visible"}
              transition={{ duration: 0.05 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center
                  shrink-0"
                >
                  <span className="text-[9px] font-black text-white">3</span>
                </div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Route
                </p>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-visible">
                <div className="relative z-30">
                  <div
                    className="flex items-center gap-3 px-4 py-3.5 focus-within:bg-white rounded-t-2xl
                  transition-colors"
                  >
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-3 h-3 bg-zinc-900 border-2 border-white shadow rounded-full" />
                      <div className="w-px h-5 bg-zinc-300 mt-1" />
                    </div>
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => {
                        setPickup(e.target.value);
                        searchAddress(e.target.value, setPickupSuggestions);
                      }}
                      className="flex-1 bg-transparent text-sm font-semibold text-zinc-900
                    placeholder:text-zinc-400 outline-none"
                      placeholder="Enter pickup location"
                    />
                    <motion.button
                      onClick={useCurrentLocation}
                      disabled={locating}
                      whileTap={{ scale: 0.88 }}
                      className="w-8 h-8 rounded-xl bg-zinc-200 hover:bg-zinc-300 transition-colors flex items-center justify-center"
                    >
                      <LocateFixed
                        size={14}
                        className={`text-zinc-800 ${locating ? "animate-spin" : ""}`}
                      />
                    </motion.button>
                  </div>
                  <AnimatePresence>
                    {pickupSuggestions?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 top-full mt-1 bg-white border border-zinc-200 rounded-b-2xl shadow-xl overflow-y-auto max-h-30 z-50"
                      >
                        {pickupSuggestions.map((p, i) => (
                          <motion.div
                            key={p.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm
                            text-left hover:bg-zinc-50 transition-colors border-b border-zinc-100
                            last:border-0"
                            onClick={() => {
                              setPickup(suggestion(p));
                              setPickupCountry(p.country ?? "");
                              setPickupLat(p.lat);
                              setPickupLon(p.lon);
                              setPickupSuggestions([]);
                            }}
                          >
                            <MapPin
                              size={13}
                              className="text-zinc-400 shrink-0"
                            />
                            <span className="text-sm text-zinc-800 font-medium truncate">
                              {suggestion(p)}
                            </span>
                            <ChevronRight
                              size={13}
                              className="text-zinc-300 shrink-0 ml-auto"
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-px bg-zinc-200" />
                <div className="relative z-10">
                  <div
                    className="flex items-center gap-3 px-4 py-3.5 focus-within:bg-white rounded-t-2xl
                  transition-colors"
                  >
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-3 h-3 bg-zinc-900 border-2 border-white shadow rounded-full" />
                    </div>
                    <input
                      disabled={!pickupCountry}
                      type="text"
                      value={drop}
                      onChange={(e) => {
                        setDrop(e.target.value);
                        searchAddress(
                          e.target.value,
                          setDropSuggestions,
                          pickupCountry,
                        );
                      }}
                      className="flex-1 bg-transparent text-sm font-semibold text-zinc-900
                    placeholder:text-zinc-400 outline-none"
                      placeholder={
                        pickupCountry
                          ? "Enter drop location"
                          : "Select pickup location first"
                      }
                    />
                    <Navigation size={14} className="text-zinc-400 shrink-0" />
                  </div>
                  <AnimatePresence>
                    {dropSuggestions?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 top-full mt-1 bg-white border border-zinc-200 rounded-b-2xl shadow-xl overflow-y-auto max-h-52 z-50"
                      >
                        {dropSuggestions.map((p, i) => (
                          <motion.div
                            key={p.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm
                            text-left hover:bg-zinc-50 transition-colors border-b border-zinc-100
                            last:border-0"
                            onClick={() => {
                              setDrop(suggestion(p));
                              setDropCountry(p.country ?? "");
                              setDropLat(p.lat);
                              setDropLon(p.lon);
                              setDropSuggestions([]);
                            }}
                          >
                            <MapPin
                              size={13}
                              className="text-zinc-400 shrink-0"
                            />
                            <span className="text-sm text-zinc-800 font-medium truncate">
                              {suggestion(p)}
                            </span>
                            <ChevronRight
                              size={13}
                              className="text-zinc-300 shrink-0 ml-auto"
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={stepVariants}
              initial={"hidden"}
              animate={"visible"}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={() => {
                  router.push(
                    `/user/search?pickup=${encodeURIComponent(pickup)}&drop=${encodeURIComponent(drop)}&mobile=${encodeURIComponent(mobile)}&vehicle=${vehicle}&pickupLat=${pickupLat}&pickupLon=${pickupLon}&dropLat=${dropLat}&dropLon=${dropLon}`,
                  );
                }}
                whileTap={{ scale: 0.97 }}
                whileHover={canContinue ? { scale: 1.02 } : {}}
                disabled={!canContinue}
                className="w-full h-14 rounded-2xl bg-zinc-900 hover:bg-black disabled:opacity-35
              text-white font-black text-sm tracking-wide flex items-center justify-center gap-2.5 transition-colors
              shadow_lg disabled:shadow-none"
              >
                <span>Continue</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default page;

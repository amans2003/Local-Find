import { Link } from 'react-router-dom';
import {
  GraduationCap, HeartPulse, Scale, Landmark, Home,
  UtensilsCrossed, ShoppingBag, Wrench, Building2, Church,
  Car, Dumbbell, Scissors, Plane, Laptop, Baby, Leaf, Briefcase,
  MapPin,
} from 'lucide-react';

const CATEGORY_MAP = {
  education:   { Icon: GraduationCap,  bg: 'bg-blue-100',    text: 'text-blue-600',    ring: 'group-hover:ring-blue-200'   },
  healthcare:  { Icon: HeartPulse,     bg: 'bg-rose-100',    text: 'text-rose-600',    ring: 'group-hover:ring-rose-200'   },
  legal:       { Icon: Scale,          bg: 'bg-amber-100',   text: 'text-amber-600',   ring: 'group-hover:ring-amber-200'  },
  finance:     { Icon: Landmark,       bg: 'bg-emerald-100', text: 'text-emerald-600', ring: 'group-hover:ring-emerald-200'},
  'real-estate': { Icon: Home,         bg: 'bg-indigo-100',  text: 'text-indigo-600',  ring: 'group-hover:ring-indigo-200' },
  restaurants: { Icon: UtensilsCrossed,bg: 'bg-orange-100',  text: 'text-orange-600',  ring: 'group-hover:ring-orange-200' },
  retail:      { Icon: ShoppingBag,    bg: 'bg-pink-100',    text: 'text-pink-600',    ring: 'group-hover:ring-pink-200'   },
  services:    { Icon: Wrench,         bg: 'bg-slate-100',   text: 'text-slate-600',   ring: 'group-hover:ring-slate-200'  },
  government:  { Icon: Building2,      bg: 'bg-teal-100',    text: 'text-teal-600',    ring: 'group-hover:ring-teal-200'   },
  religious:   { Icon: Church,         bg: 'bg-purple-100',  text: 'text-purple-600',  ring: 'group-hover:ring-purple-200' },
  automotive:  { Icon: Car,            bg: 'bg-zinc-100',    text: 'text-zinc-600',    ring: 'group-hover:ring-zinc-200'   },
  fitness:     { Icon: Dumbbell,       bg: 'bg-lime-100',    text: 'text-lime-600',    ring: 'group-hover:ring-lime-200'   },
  beauty:      { Icon: Scissors,       bg: 'bg-fuchsia-100', text: 'text-fuchsia-600', ring: 'group-hover:ring-fuchsia-200'},
  travel:      { Icon: Plane,          bg: 'bg-sky-100',     text: 'text-sky-600',     ring: 'group-hover:ring-sky-200'    },
  technology:  { Icon: Laptop,         bg: 'bg-cyan-100',    text: 'text-cyan-600',    ring: 'group-hover:ring-cyan-200'   },
  childcare:   { Icon: Baby,           bg: 'bg-yellow-100',  text: 'text-yellow-600',  ring: 'group-hover:ring-yellow-200' },
  agriculture: { Icon: Leaf,           bg: 'bg-green-100',   text: 'text-green-600',   ring: 'group-hover:ring-green-200'  },
  business:    { Icon: Briefcase,      bg: 'bg-blue-100',    text: 'text-blue-600',    ring: 'group-hover:ring-blue-200'   },
};

const DEFAULT = { Icon: MapPin, bg: 'bg-gray-100', text: 'text-gray-500', ring: 'group-hover:ring-gray-200' };

export default function CategoryCard({ category }) {
  const { Icon, bg, text, ring } = CATEGORY_MAP[category.slug] || DEFAULT;

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group bg-white border border-border rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-transparent hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center ring-4 ring-transparent ${ring} transition-all duration-200`}>
        <Icon className={`w-7 h-7 ${text}`} strokeWidth={1.75} />
      </div>
      <div className="text-center">
        <p className={`font-semibold text-sm text-text-dark group-hover:${text} transition-colors`}>
          {category.name}
        </p>
        {category.listingCount > 0 && (
          <p className="text-xs text-text-muted mt-0.5">{category.listingCount} listings</p>
        )}
      </div>
    </Link>
  );
}

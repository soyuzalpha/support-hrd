"use client";

import { useColorSchema } from "@/hooks/use-color-schema";
import { useUI } from "@/context/app-context";
import { useBackground } from "@/hooks/use-backgrounds";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Palette } from "lucide-react";
import { type ColorSchema, getSchemasByCategory } from "@/lib/color-schemas";

const ANIMATED_BACKGROUNDS = [
  { key: "silk", label: "Silk" },
  { key: "beams", label: "Beams" },
  { key: "colorbends", label: "Color Bends" },
];

export function ColorSchemaToggle() {
  const { setSolidFromSchema } = useBackground();
  const { schema, setSchema, mounted } = useColorSchema();
  const { ui, updateUI } = useUI();

  if (!mounted) return null;

  const schemasByCategory = getSchemasByCategory();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle color schema</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Color Schemas</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* ---- NORMAL COLOR SCHEMAS ---- */}
        {Object.entries(schemasByCategory).map(([category, schemas], categoryIndex) => (
          <div key={category}>
            {categoryIndex > 0 && <DropdownMenuSeparator />}
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{category}</div>

            {schemas.map(([key, value]) => (
              <DropdownMenuItem
                key={key}
                // onClick={() => setSchema(key as ColorSchema)}
                onClick={() => {
                  setSchema(key as ColorSchema);

                  // Ubah background jadi solid berdasarkan schema
                  const bg = value.colors.card;
                  setSolidFromSchema(bg);
                }}
                className={schema === key ? "bg-accent" : ""}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full border border-border"
                    style={{ backgroundColor: value.colors.background }}
                  />
                  {value.label}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        ))}

        {/* ---- ANIMATED BACKGROUND ---- */}
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Animated Backgrounds</div>

        {ANIMATED_BACKGROUNDS.map((bg) => (
          <DropdownMenuItem
            key={bg.key}
            //@ts-ignore
            onClick={() => updateUI({ background: bg.key })}
            className={ui?.background === bg.key ? "bg-accent" : ""}
          >
            {bg.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// "use client";

// import { useColorSchema } from "@/hooks/use-color-schema";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import { Palette } from "lucide-react";
// import { type ColorSchema, getSchemasByCategory } from "@/lib/color-schemas";

// export function ColorSchemaToggle() {
//   const { schema, setSchema, mounted, getColorSchemaColors } = useColorSchema();

//   if (!mounted) return null;

//   const schemasByCategory = getSchemasByCategory();

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon">
//           <Palette className="h-[1.2rem] w-[1.2rem]" />
//           <span className="sr-only">Toggle color schema</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-56">
//         <DropdownMenuLabel>Color Schemas</DropdownMenuLabel>
//         <DropdownMenuSeparator />

//         {Object.entries(schemasByCategory).map(([category, schemas], categoryIndex) => (
//           <div key={category}>
//             {categoryIndex > 0 && <DropdownMenuSeparator />}
//             <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{category}</div>
//             {schemas.map(([key, value]) => (
//               <DropdownMenuItem
//                 key={key}
//                 onClick={() => setSchema(key as ColorSchema)}
//                 className={schema === key ? "bg-accent" : ""}
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className="h-4 w-4 rounded-full border border-border"
//                     style={{
//                       backgroundColor: value.colors.background,
//                     }}
//                   />
//                   {value.label}
//                 </div>
//               </DropdownMenuItem>
//             ))}
//           </div>
//         ))}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

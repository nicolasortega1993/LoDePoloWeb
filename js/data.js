// ============================================================
// Menú por defecto de Lo de Polo, tomado de las cartas del local.
// Se usa una sola vez para "sembrar" Firestore desde el panel admin
// (botón "Cargar menú inicial"). Después de eso, todo se edita
// desde el panel y estos datos ya no se vuelven a usar.
// Los precios son los que aparecen en las fotos: revisalos y
// corregilos desde el panel si algo cambió.
// ============================================================

const DEFAULT_SETTINGS = {
  businessName: "Lo de Polo",
  tagline: "Rotisería",
  whatsapp: "5493425308949", // +54 9 3425 30-8949
  instagram: "@lodepolo.comidas",
  hours: "Martes a domingo, 11 a 14hs y 19 a 22:30hs",
};

const DEFAULT_ITEMS = [
  // Empanadas
  { name: "Docena de empanadas (a elección)", description: "Carne, jamón y queso, verdura, o cebolla y queso", price: 18000, category: "Empanadas", available: true, imageUrl: "" },
  { name: "Empanada de carne", description: "Unidad", price: 1600, category: "Empanadas", available: true, imageUrl: "" },
  { name: "Empanada de jamón y queso", description: "Unidad", price: 1600, category: "Empanadas", available: true, imageUrl: "" },
  { name: "Empanada de verdura", description: "Unidad", price: 1600, category: "Empanadas", available: true, imageUrl: "" },
  { name: "Empanada de cebolla y queso", description: "Unidad", price: 1600, category: "Empanadas", available: true, imageUrl: "" },

  // Pizzas
  { name: "Pizza mozzarella", description: "", price: 9000, category: "Pizzas", available: true, imageUrl: "" },
  { name: "Pizza provenzal", description: "", price: 11000, category: "Pizzas", available: true, imageUrl: "" },
  { name: "Pizza cebollada", description: "", price: 11000, category: "Pizzas", available: true, imageUrl: "" },
  { name: "Pizza napolitana", description: "", price: 14000, category: "Pizzas", available: true, imageUrl: "" },
  { name: "Pizza especial", description: "Jamón, huevo y morrón", price: 15000, category: "Pizzas", available: true, imageUrl: "" },
  { name: "Pizza roquefort", description: "", price: 17500, category: "Pizzas", available: true, imageUrl: "" },
  { name: "Pizza rúcula y jamón", description: "", price: 17000, category: "Pizzas", available: true, imageUrl: "" },
  { name: "Fugazza jamón y queso", description: "", price: 3500, category: "Pizzas", available: true, imageUrl: "" },

  // Al plato
  { name: "Milanesa de carne al plato", description: "Con puré o papas fritas", price: 9000, category: "Al plato", available: true, imageUrl: "" },
  { name: "Milanesa napolitana al plato", description: "Con puré o papas fritas", price: 11000, category: "Al plato", available: true, imageUrl: "" },
  { name: "Milanesa de pollo al plato", description: "Con puré o papas fritas", price: 8500, category: "Al plato", available: true, imageUrl: "" },
  { name: "Milanesa de pollo rebozada", description: "Rebozada en pan, con puré o papas fritas", price: 10000, category: "Al plato", available: true, imageUrl: "" },
  { name: "Pollo al grille", description: "Con omelette de champiñones", price: 9000, category: "Al plato", available: true, imageUrl: "" },

  // Sandwiches de milanesa de pollo
  { name: "Sandwich de milanesa de pollo - Lechuga y tomate", description: "", price: 6000, category: "Sandwiches de milanesa", available: true, imageUrl: "" },
  { name: "Sandwich de milanesa de pollo - Completo", description: "", price: 7000, category: "Sandwiches de milanesa", available: true, imageUrl: "" },
  { name: "Sandwich de milanesa de pollo - Completo con papas", description: "", price: 8500, category: "Sandwiches de milanesa", available: true, imageUrl: "" },

  // Sandwiches de milanesa de carne
  { name: "Sandwich de milanesa de carne - Lechuga y tomate", description: "", price: 7000, category: "Sandwiches de milanesa", available: true, imageUrl: "" },
  { name: "Sandwich de milanesa de carne - Completo", description: "", price: 8000, category: "Sandwiches de milanesa", available: true, imageUrl: "" },
  { name: "Sandwich de milanesa de carne - Completo con papas", description: "", price: 9000, category: "Sandwiches de milanesa", available: true, imageUrl: "" },

  // Hamburguesas
  { name: "Hamburguesa - Lechuga y tomate", description: "", price: 5500, category: "Hamburguesas", available: true, imageUrl: "" },
  { name: "Hamburguesa - Completo", description: "", price: 7000, category: "Hamburguesas", available: true, imageUrl: "" },
  { name: "Hamburguesa - Completo con papas", description: "", price: 8500, category: "Hamburguesas", available: true, imageUrl: "" },

  // Sandwich de lomo
  { name: "Sandwich de lomo - Lechuga y tomate", description: "", price: 14000, category: "Sandwich de lomo", available: true, imageUrl: "" },
  { name: "Sandwich de lomo - Completo", description: "", price: 17000, category: "Sandwich de lomo", available: true, imageUrl: "" },
  { name: "Sandwich de lomo - Completo con papas", description: "", price: 19000, category: "Sandwich de lomo", available: true, imageUrl: "" },

  // Extras
  { name: "Porción de papas fritas", description: "", price: 5000, category: "Extras", available: true, imageUrl: "" },
  { name: "Porción de papas con cheddar", description: "", price: 7000, category: "Extras", available: true, imageUrl: "" },

  // Pollo a la parrilla / menú diario
  { name: "Pollo a la parrilla", description: "Con papas fritas o ensalada", price: 0, category: "Menú del día", available: true, imageUrl: "" },
  { name: "Menú diario", description: "Consultar precio del día", price: 0, category: "Menú del día", available: true, imageUrl: "" },
  { name: "Vianda", description: "", price: 7000, category: "Menú del día", available: true, imageUrl: "" },
];

function currency(n) {
  const num = Number(n) || 0;
  if (num === 0) return "Consultar";
  return "$" + num.toLocaleString("es-AR");
}

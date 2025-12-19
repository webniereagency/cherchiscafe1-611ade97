import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';

// Import food images
import waffles from '@/assets/waffles.png';
import espresso from '@/assets/espresso.png';
import oatmeal from '@/assets/oatmeal.png';
import icedLatte from '@/assets/iced-latte.png';
import coffeeCupBrand from '@/assets/coffee-cup-brand.png';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

const menuData: MenuItem[] = [
  // Breakfast & Food
  { id: 'cheese-croissants', name: 'Cheese Croissants', price: 250, category: 'Breakfast & Pastries', image: waffles, description: 'Buttery, flaky croissants filled with melted cheese. Perfect with your morning coffee.' },
  { id: 'waffles-half', name: 'Waffles Basic (Half)', price: 120, category: 'Breakfast & Pastries', image: waffles, description: 'Light and crispy Belgian-style waffle. Just right for a light bite.' },
  { id: 'waffles-full', name: 'Waffles Basic (Full)', price: 250, category: 'Breakfast & Pastries', image: waffles, description: 'Full portion of our signature crispy waffles, golden and delicious.' },
  { id: 'wraps', name: 'Wraps (Cheese/Beef/Chicken)', price: 250, category: 'Breakfast & Pastries', image: oatmeal, description: 'Warm tortilla wraps with your choice of melted cheese, seasoned beef, or grilled chicken.' },
  { id: 'oatmeal', name: 'Oatmeal Fruit & Honey', price: 250, category: 'Breakfast & Pastries', image: oatmeal, description: 'Creamy oatmeal topped with fresh seasonal fruits and a drizzle of Ethiopian honey.' },
  { id: 'grilled-cheese', name: 'Grilled Cheese', price: 180, category: 'Breakfast & Pastries', image: oatmeal, description: 'Classic comfort food—golden toasted bread with melted cheese inside.' },
  { id: 'avocado-toast', name: 'Avocado Toast', price: 180, category: 'Breakfast & Pastries', image: oatmeal, description: 'Fresh smashed avocado on artisan brown bread, seasoned to perfection.' },
  { id: 'avocado-toast-omelet', name: 'Avocado Toast with Omelet', price: 320, category: 'Breakfast & Pastries', image: oatmeal, description: 'Our avocado toast elevated with a fluffy, golden omelet.' },
  { id: 'cheese-omelet', name: 'Cheese Omelet with Veggies', price: 300, category: 'Breakfast & Pastries', image: oatmeal, description: 'Fluffy eggs folded with melted cheese and fresh garden vegetables.' },
  { id: 'omelet-veggies', name: 'Omelet with Veggies', price: 250, category: 'Breakfast & Pastries', image: oatmeal, description: 'Light and healthy omelet loaded with colorful vegetables.' },
  { id: 'french-toast-fruits', name: 'French Toast with Fruits', price: 250, category: 'Breakfast & Pastries', image: waffles, description: 'Golden French toast topped with fresh fruits—a sweet start to your day.' },
  { id: 'french-toast-cheese', name: 'French Toast with Cheese', price: 280, category: 'Breakfast & Pastries', image: waffles, description: 'Savory twist on a classic—French toast with melted cheese.' },
  { id: 'plain-croissants', name: 'Plain Croissants', price: 150, category: 'Breakfast & Pastries', image: waffles, description: 'Classic butter croissant, perfectly flaky and fresh from the oven.' },
  { id: 'pastries', name: 'Seasonal Pastries', price: 150, category: 'Breakfast & Pastries', image: waffles, description: 'Our daily selection of fresh-baked pastries. Ask what\'s special today.' },
  
  // Coffee
  { id: 'espresso', name: 'Espresso', price: 45, category: 'Coffee', image: espresso, description: 'Bold, rich single shot of our house-roasted Ethiopian beans.' },
  { id: 'macchiato', name: 'Macchiato', price: 55, category: 'Coffee', image: espresso, description: 'Espresso "marked" with a touch of foamed milk.' },
  { id: 'americano', name: 'Americano', price: 60, category: 'Coffee', image: espresso, description: 'Smooth espresso diluted with hot water for a longer, gentler coffee.' },
  { id: 'cappuccino', name: 'Cappuccino', price: 75, category: 'Coffee', image: coffeeCupBrand, description: 'Classic Italian-style with equal parts espresso, steamed milk, and foam.' },
  { id: 'latte', name: 'Caffè Latte', price: 80, category: 'Coffee', image: coffeeCupBrand, description: 'Silky smooth espresso with steamed milk and light foam.' },
  { id: 'mocha', name: 'Mocha', price: 90, category: 'Coffee', image: coffeeCupBrand, description: 'Rich espresso meets chocolate, topped with steamed milk.' },
  
  // Cold Drinks
  { id: 'iced-latte', name: 'Iced Latte', price: 90, category: 'Cold Drinks', image: icedLatte, description: 'Chilled espresso with cold milk over ice—refreshing and smooth.' },
  { id: 'iced-americano', name: 'Iced Americano', price: 70, category: 'Cold Drinks', image: icedLatte, description: 'Bold espresso over ice with cold water. Crisp and invigorating.' },
  { id: 'cold-brew', name: 'Cold Brew', price: 85, category: 'Cold Drinks', image: icedLatte, description: '12-hour steeped coffee, naturally sweet with low acidity.' },
  { id: 'fresh-juice', name: 'Fresh Juice', price: 80, category: 'Cold Drinks', image: icedLatte, description: 'Daily selection of freshly squeezed fruit juices.' },
  
  // Tea
  { id: 'black-tea', name: 'Black Tea', price: 40, category: 'Tea', image: coffeeCupBrand, description: 'Traditional Ethiopian black tea, bold and warming.' },
  { id: 'green-tea', name: 'Green Tea', price: 45, category: 'Tea', image: coffeeCupBrand, description: 'Light and refreshing green tea with natural antioxidants.' },
  { id: 'chai-latte', name: 'Chai Latte', price: 75, category: 'Tea', image: coffeeCupBrand, description: 'Spiced tea blended with steamed milk—aromatic and comforting.' },
  
  // Special Drinks
  { id: 'jebena-coffee', name: 'Jebena Coffee', price: 100, category: 'House Specials', image: coffeeCupBrand, description: 'Traditional Ethiopian coffee ceremony style—roasted, ground, and brewed in a clay pot.' },
  { id: 'honey-latte', name: 'Honey Latte', price: 95, category: 'House Specials', image: coffeeCupBrand, description: 'Our signature latte sweetened with local Ethiopian honey.' },
  { id: 'spiced-mocha', name: 'Spiced Mocha', price: 100, category: 'House Specials', image: coffeeCupBrand, description: 'Ethiopian spices meet rich chocolate and espresso—uniquely Cherish.' },
];

const categories = ['All', 'Breakfast & Pastries', 'Coffee', 'Cold Drinks', 'Tea', 'House Specials'];

interface MenuProps {
  onOrderItem: (item: MenuItem) => void;
}

const Menu = ({ onOrderItem }: MenuProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const filteredItems = activeCategory === 'All' 
    ? menuData 
    : menuData.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-24 md:py-32 bg-background" ref={ref}>
      <div className="section-container">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm uppercase tracking-[0.2em] text-primary">Our Menu</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-4 mb-6">
            Carefully Crafted
            <span className="text-primary italic"> For You</span>
          </h2>
          <div className="accent-line mb-6" />
          <p className="text-muted-foreground">
            From traditional Ethiopian coffee to signature breakfast items, every item is made with care.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Menu Grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="menu-card cursor-pointer group"
                onClick={() => setSelectedItem(item)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wider text-primary mb-1">{item.category}</p>
                  <h3 className="font-serif text-lg mb-2">{item.name}</h3>
                  <p className="text-xl font-medium text-accent">{item.price} ETB</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Item Modal */}
      <AnimatePresence>
        {selectedItem && (
          <MenuItemModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onOrder={onOrderItem}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

interface MenuItemModalProps {
  item: MenuItem;
  onClose: () => void;
  onOrder: (item: MenuItem) => void;
}

const MenuItemModal = ({ item, onClose, onOrder }: MenuItemModalProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleOrder = () => {
    for (let i = 0; i < quantity; i++) {
      onOrder(item);
    }
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-background/90 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal Content */}
      <motion.div
        className="relative bg-card rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image */}
        <div className="aspect-video relative overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 -mt-8 relative">
          <span className="text-xs uppercase tracking-wider text-primary">{item.category}</span>
          <h3 className="font-serif text-2xl md:text-3xl mt-2 mb-3">{item.name}</h3>
          <p className="text-muted-foreground mb-6">{item.description}</p>

          <div className="flex items-center justify-between mb-6">
            <p className="text-2xl font-medium text-accent">{item.price} ETB</p>
            
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={handleOrder}
            className="w-full btn-primary text-center"
          >
            Add to Order — {item.price * quantity} ETB
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Menu;
export { menuData };

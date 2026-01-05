import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

// Import real menu images
import espressoImg from '@/assets/menu/espresso.jpg';
import macchiatoImg from '@/assets/menu/macchiato.jpg';
import americanoImg from '@/assets/menu/americano.jpg';
import cappuccinoImg from '@/assets/menu/cappuccino.jpg';
import latteImg from '@/assets/menu/latte.jpg';
import mochaImg from '@/assets/menu/mocha.jpg';
import icedLatteImg from '@/assets/menu/iced-latte.jpg';
import icedAmericanoImg from '@/assets/menu/iced-americano.jpg';
import coldBrewImg from '@/assets/menu/cold-brew.jpg';
import freshJuiceImg from '@/assets/menu/fresh-juice.jpg';
import blackTeaImg from '@/assets/menu/black-tea.jpg';
import greenTeaImg from '@/assets/menu/green-tea.jpg';
import chaiLatteImg from '@/assets/menu/chai-latte.jpg';
import jebenaCoffeeImg from '@/assets/menu/jebena-coffee.jpg';
import honeyLatteImg from '@/assets/menu/honey-latte.jpg';
import spicedMochaImg from '@/assets/menu/spiced-mocha.jpg';
import cheeseCroissantsImg from '@/assets/menu/cheese-croissants.jpg';
import wafflesImg from '@/assets/menu/waffles.jpg';
import wrapsImg from '@/assets/menu/wraps.jpg';
import oatmealImg from '@/assets/menu/oatmeal.jpg';
import grilledCheeseImg from '@/assets/menu/grilled-cheese.jpg';
import avocadoToastImg from '@/assets/menu/avocado-toast.jpg';
import avocadoToastOmeletImg from '@/assets/menu/avocado-toast-omelet.jpg';
import cheeseOmeletImg from '@/assets/menu/cheese-omelet.jpg';
import veggieOmeletImg from '@/assets/menu/veggie-omelet.jpg';
import frenchToastFruitsImg from '@/assets/menu/french-toast-fruits.jpg';
import frenchToastCheeseImg from '@/assets/menu/french-toast-cheese.jpg';
import plainCroissantsImg from '@/assets/menu/plain-croissants.jpg';
import pastriesImg from '@/assets/menu/pastries.jpg';

export interface MenuItem {
  id: string;
  nameKey: string;
  name: string;
  price: number;
  category: string;
  categoryKey: string;
  image: string;
  descriptionKey: string;
  description: string;
}

const menuData: MenuItem[] = [
  // Breakfast & Food
  { id: 'cheese-croissants', nameKey: 'menu.cheeseCroissants', name: 'Cheese Croissants', price: 250, category: 'Breakfast & Pastries', categoryKey: 'menu.category.breakfast', image: cheeseCroissantsImg, descriptionKey: 'menu.cheeseCroissantsDesc', description: 'Buttery, flaky croissants filled with melted cheese. Perfect with your morning coffee.' },
  { id: 'waffles-half', nameKey: 'menu.wafflesHalf', name: 'Waffles Basic (Half)', price: 120, category: 'Breakfast & Pastries', categoryKey: 'menu.category.breakfast', image: wafflesImg, descriptionKey: 'menu.wafflesHalfDesc', description: 'Light and crispy Belgian-style waffle. Just right for a light bite.' },
  { id: 'waffles-full', nameKey: 'menu.wafflesFull', name: 'Waffles Basic (Full)', price: 250, category: 'Breakfast & Pastries', categoryKey: 'menu.category.breakfast', image: wafflesImg, descriptionKey: 'menu.wafflesFullDesc', description: 'Full portion of our signature crispy waffles, golden and delicious.' },
  { id: 'wraps', nameKey: 'menu.wraps', name: 'Wraps (Cheese/Beef/Chicken)', price: 250, category: 'Breakfast & Pastries', categoryKey: 'menu.category.breakfast', image: wrapsImg, descriptionKey: 'menu.wrapsDesc', description: 'Warm tortilla wraps with your choice of melted cheese, seasoned beef, or grilled chicken.' },
  { id: 'oatmeal', nameKey: 'menu.oatmeal', name: 'Oatmeal Fruit & Honey', price: 250, category: 'Breakfast & Pastries', categoryKey: 'menu.category.breakfast', image: oatmealImg, descriptionKey: 'menu.oatmealDesc', description: 'Creamy oatmeal topped with fresh seasonal fruits and a drizzle of Ethiopian honey.' },
  { id: 'grilled-cheese', nameKey: 'menu.grilledCheese', name: 'Grilled Cheese', price: 180, category: 'Breakfast & Pastries', categoryKey: 'menu.category.breakfast', image: grilledCheeseImg, descriptionKey: 'menu.grilledCheeseDesc', description: 'Classic comfort food—golden toasted bread with melted cheese inside.' },
  { id: 'avocado-toast', nameKey: 'menu.avocadoToast', name: 'Avocado Toast', price: 180, category: 'Breakfast & Pastries', categoryKey: 'menu.category.breakfast', image: avocadoToastImg, descriptionKey: 'menu.avocadoToastDesc', description: 'Fresh smashed avocado on artisan brown bread, seasoned to perfection.' },
  { id: 'avocado-toast-omelet', nameKey: 'menu.avocadoToastOmelet', name: 'Avocado Toast with Omelet', price: 320, category: 'Breakfast & Pastries', categoryKey: 'menu.category.breakfast', image: avocadoToastOmeletImg, descriptionKey: 'menu.avocadoToastOmeletDesc', description: 'Our avocado toast elevated with a fluffy, golden omelet.' },
  { id: 'cheese-omelet', nameKey: 'menu.cheeseOmelet', name: 'Cheese Omelet with Veggies', price: 300, category: 'Breakfast & Pastries', categoryKey: 'menu.category.breakfast', image: cheeseOmeletImg, descriptionKey: 'menu.cheeseOmeletDesc', description: 'Fluffy eggs folded with melted cheese and fresh garden vegetables.' },
  { id: 'omelet-veggies', nameKey: 'menu.omeletVeggies', name: 'Omelet with Veggies', price: 250, category: 'Breakfast & Pastries', categoryKey: 'menu.category.breakfast', image: veggieOmeletImg, descriptionKey: 'menu.omeletVeggiesDesc', description: 'Light and healthy omelet loaded with colorful vegetables.' },
  { id: 'french-toast-fruits', nameKey: 'menu.frenchToastFruits', name: 'French Toast with Fruits', price: 250, category: 'Breakfast & Pastries', categoryKey: 'menu.category.breakfast', image: frenchToastFruitsImg, descriptionKey: 'menu.frenchToastFruitsDesc', description: 'Golden French toast topped with fresh fruits—a sweet start to your day.' },
  { id: 'french-toast-cheese', nameKey: 'menu.frenchToastCheese', name: 'French Toast with Cheese', price: 280, category: 'Breakfast & Pastries', categoryKey: 'menu.category.breakfast', image: frenchToastCheeseImg, descriptionKey: 'menu.frenchToastCheeseDesc', description: 'Savory twist on a classic—French toast with melted cheese.' },
  { id: 'plain-croissants', nameKey: 'menu.plainCroissants', name: 'Plain Croissants', price: 150, category: 'Breakfast & Pastries', categoryKey: 'menu.category.breakfast', image: plainCroissantsImg, descriptionKey: 'menu.plainCroissantsDesc', description: 'Classic butter croissant, perfectly flaky and fresh from the oven.' },
  { id: 'pastries', nameKey: 'menu.pastries', name: 'Seasonal Pastries', price: 150, category: 'Breakfast & Pastries', categoryKey: 'menu.category.breakfast', image: pastriesImg, descriptionKey: 'menu.pastriesDesc', description: 'Our daily selection of fresh-baked pastries. Ask what\'s special today.' },
  
  // Coffee
  { id: 'espresso', nameKey: 'menu.espresso', name: 'Espresso', price: 45, category: 'Coffee', categoryKey: 'menu.category.coffee', image: espressoImg, descriptionKey: 'menu.espressoDesc', description: 'Bold, rich single shot of our house-roasted Ethiopian beans.' },
  { id: 'macchiato', nameKey: 'menu.macchiato', name: 'Macchiato', price: 55, category: 'Coffee', categoryKey: 'menu.category.coffee', image: macchiatoImg, descriptionKey: 'menu.macchiatoDesc', description: 'Espresso "marked" with a touch of foamed milk.' },
  { id: 'americano', nameKey: 'menu.americano', name: 'Americano', price: 60, category: 'Coffee', categoryKey: 'menu.category.coffee', image: americanoImg, descriptionKey: 'menu.americanoDesc', description: 'Smooth espresso diluted with hot water for a longer, gentler coffee.' },
  { id: 'cappuccino', nameKey: 'menu.cappuccino', name: 'Cappuccino', price: 75, category: 'Coffee', categoryKey: 'menu.category.coffee', image: cappuccinoImg, descriptionKey: 'menu.cappuccinoDesc', description: 'Classic Italian-style with equal parts espresso, steamed milk, and foam.' },
  { id: 'latte', nameKey: 'menu.latte', name: 'Caffè Latte', price: 80, category: 'Coffee', categoryKey: 'menu.category.coffee', image: latteImg, descriptionKey: 'menu.latteDesc', description: 'Silky smooth espresso with steamed milk and light foam.' },
  { id: 'mocha', nameKey: 'menu.mocha', name: 'Mocha', price: 90, category: 'Coffee', categoryKey: 'menu.category.coffee', image: mochaImg, descriptionKey: 'menu.mochaDesc', description: 'Rich espresso meets chocolate, topped with steamed milk.' },
  
  // Cold Drinks
  { id: 'iced-latte', nameKey: 'menu.icedLatte', name: 'Iced Latte', price: 90, category: 'Cold Drinks', categoryKey: 'menu.category.coldDrinks', image: icedLatteImg, descriptionKey: 'menu.icedLatteDesc', description: 'Chilled espresso with cold milk over ice—refreshing and smooth.' },
  { id: 'iced-americano', nameKey: 'menu.icedAmericano', name: 'Iced Americano', price: 70, category: 'Cold Drinks', categoryKey: 'menu.category.coldDrinks', image: icedAmericanoImg, descriptionKey: 'menu.icedAmericanoDesc', description: 'Bold espresso over ice with cold water. Crisp and invigorating.' },
  { id: 'cold-brew', nameKey: 'menu.coldBrew', name: 'Cold Brew', price: 85, category: 'Cold Drinks', categoryKey: 'menu.category.coldDrinks', image: coldBrewImg, descriptionKey: 'menu.coldBrewDesc', description: '12-hour steeped coffee, naturally sweet with low acidity.' },
  { id: 'fresh-juice', nameKey: 'menu.freshJuice', name: 'Fresh Juice', price: 80, category: 'Cold Drinks', categoryKey: 'menu.category.coldDrinks', image: freshJuiceImg, descriptionKey: 'menu.freshJuiceDesc', description: 'Daily selection of freshly squeezed fruit juices.' },
  
  // Tea
  { id: 'black-tea', nameKey: 'menu.blackTea', name: 'Black Tea', price: 40, category: 'Tea', categoryKey: 'menu.category.tea', image: blackTeaImg, descriptionKey: 'menu.blackTeaDesc', description: 'Traditional Ethiopian black tea, bold and warming.' },
  { id: 'green-tea', nameKey: 'menu.greenTea', name: 'Green Tea', price: 45, category: 'Tea', categoryKey: 'menu.category.tea', image: greenTeaImg, descriptionKey: 'menu.greenTeaDesc', description: 'Light and refreshing green tea with natural antioxidants.' },
  { id: 'chai-latte', nameKey: 'menu.chaiLatte', name: 'Chai Latte', price: 75, category: 'Tea', categoryKey: 'menu.category.tea', image: chaiLatteImg, descriptionKey: 'menu.chaiLatteDesc', description: 'Spiced tea blended with steamed milk—aromatic and comforting.' },
  
  // Special Drinks
  { id: 'jebena-coffee', nameKey: 'menu.jebenaCoffee', name: 'Jebena Coffee', price: 100, category: 'House Specials', categoryKey: 'menu.category.specials', image: jebenaCoffeeImg, descriptionKey: 'menu.jebenaCoffeeDesc', description: 'Traditional Ethiopian coffee ceremony style—roasted, ground, and brewed in a clay pot.' },
  { id: 'honey-latte', nameKey: 'menu.honeyLatte', name: 'Honey Latte', price: 95, category: 'House Specials', categoryKey: 'menu.category.specials', image: honeyLatteImg, descriptionKey: 'menu.honeyLatteDesc', description: 'Our signature latte sweetened with local Ethiopian honey.' },
  { id: 'spiced-mocha', nameKey: 'menu.spicedMocha', name: 'Spiced Mocha', price: 100, category: 'House Specials', categoryKey: 'menu.category.specials', image: spicedMochaImg, descriptionKey: 'menu.spicedMochaDesc', description: 'Ethiopian spices meet rich chocolate and espresso—uniquely Cherish.' },
];

const categoryKeys = [
  { key: 'all', label: 'All', categoryKey: 'menu.category.all' },
  { key: 'Breakfast & Pastries', label: 'Breakfast & Pastries', categoryKey: 'menu.category.breakfast' },
  { key: 'Coffee', label: 'Coffee', categoryKey: 'menu.category.coffee' },
  { key: 'Cold Drinks', label: 'Cold Drinks', categoryKey: 'menu.category.coldDrinks' },
  { key: 'Tea', label: 'Tea', categoryKey: 'menu.category.tea' },
  { key: 'House Specials', label: 'House Specials', categoryKey: 'menu.category.specials' },
];

interface MenuProps {
  onOrderItem: (item: MenuItem) => void;
}

const Menu = ({ onOrderItem }: MenuProps) => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const filteredItems = activeCategory === 'all' 
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
          <span className="text-sm uppercase tracking-[0.2em] text-primary">{t('menu.subtitle')}</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-4 mb-6">
            {t('menu.title')}
            <span className="text-primary italic"> {t('menu.titleHighlight')}</span>
          </h2>
          <div className="accent-line mb-6" />
          <p className="text-muted-foreground">
            {t('menu.description')}
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categoryKeys.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {t(cat.categoryKey)}
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
                    alt={t(item.nameKey)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wider text-primary mb-1">{t(item.categoryKey)}</p>
                  <h3 className="font-serif text-lg mb-2">{t(item.nameKey)}</h3>
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
  const { t } = useLanguage();
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
            alt={t(item.nameKey)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 -mt-8 relative">
          <span className="text-xs uppercase tracking-wider text-primary">{t(item.categoryKey)}</span>
          <h3 className="font-serif text-2xl md:text-3xl mt-2 mb-3">{t(item.nameKey)}</h3>
          <p className="text-muted-foreground mb-6">{t(item.descriptionKey)}</p>

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
            {t('menu.addToOrder')} — {item.price * quantity} ETB
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Menu;
export { menuData };

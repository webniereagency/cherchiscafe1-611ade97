import { useState, useCallback } from 'react';
import Preloader from '@/components/Preloader';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Atmosphere from '@/components/Atmosphere';
import Menu, { MenuItem } from '@/components/Menu';
import OrderSystem from '@/components/OrderSystem';
import Reviews from '@/components/Reviews';
import Location from '@/components/Location';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orderItems, setOrderItems] = useState<MenuItem[]>([]);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleExploreMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOrderAhead = () => {
    setIsOrderOpen(true);
  };

  const handleAddToOrder = (item: MenuItem) => {
    setOrderItems(prev => [...prev, item]);
  };

  const handleRemoveFromOrder = (id: string) => {
    setOrderItems(prev => {
      const index = prev.findIndex(item => item.id === id);
      if (index !== -1) {
        const newItems = [...prev];
        newItems.splice(index, 1);
        return newItems;
      }
      return prev;
    });
  };

  const handleClearOrder = () => {
    setOrderItems([]);
  };

  return (
    <>
      {/* Preloader */}
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Header */}
      {!isLoading && (
        <Header orderCount={orderItems.length} onOrderClick={() => setIsOrderOpen(true)} />
      )}

      {/* Main Content */}
      <main className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
        <Hero onExploreMenu={handleExploreMenu} onOrderAhead={handleOrderAhead} />
        <About />
        <Atmosphere />
        <Menu onOrderItem={handleAddToOrder} />
        <Reviews />
        <Location />
        <Contact />
        <Footer />
      </main>

      {/* Floating Order Button - Mobile only when scrolled */}
      {orderItems.length > 0 && !isOrderOpen && (
        <button
          onClick={() => setIsOrderOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-3 md:hidden"
        >
          <span className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm font-medium">
            {orderItems.length}
          </span>
          View Order
        </button>
      )}

      {/* Order System Modal */}
      <OrderSystem
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        orderItems={orderItems}
        onRemoveItem={handleRemoveFromOrder}
        onClearOrder={handleClearOrder}
      />
    </>
  );
};

export default Index;

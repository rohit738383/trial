import { Navigation } from "./(users)/components/Navigation";
import Footer from "./(users)/components/Footer";
import Homepage from "./(users)/components/Hompage"
import ScrollingBanner from "./(users)/components/Scrolling-banner";
export default function Home() {
  return (
    
   <div>
    <Navigation />
    <ScrollingBanner />
    <Homepage />
     <Footer />
   </div>

  );
}

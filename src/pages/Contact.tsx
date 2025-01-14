import { Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/0e1e6550-b588-485a-bf15-83042085c242.png" 
              alt="Əlaqə" 
              className="h-16"
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">Ünvan</h2>
              <p className="text-gray-700">
                Bakı şəhəri, Nərimanov r-nu, Z.Bünyadov Pr-ti,<br />
                Məhəllə 1965, Çinar Park, Bina 1, AZ1075
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">Telefon</h2>
              <p className="text-gray-700">Baş ofis: 012 525 48 48</p>
              <p className="text-gray-700">Qaynar xətt: 828</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">E-mail</h2>
              <p className="text-gray-700">info@gubre.az</p>
            </div>

            {/* Social Media Icons */}
            <div>
              <h2 className="text-xl font-semibold text-primary mb-4">Sosial Media</h2>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="p-2 rounded-full hover:bg-primary/10 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a 
                  href="#" 
                  className="p-2 rounded-full hover:bg-primary/10 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

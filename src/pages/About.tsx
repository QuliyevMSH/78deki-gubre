import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Fixed Background */}
      <section 
        className="h-[60vh] relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://i.pinimg.com/1200x/ef/39/54/ef39541a6b7134bff56c191d09dc1717.jpg')",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full flex items-center justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold text-white text-center"
          >
            Haqqımızda
          </motion.h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-[#F2FCE2]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto space-y-12"
          >
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-gray-900">
                · Zəhmətkeş Fermerlər Üçün Yüksək Səviyyəli Xidmət
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Ölkəmizin ucqar, dağətəyi rayonlarından tutmuş, istənilən bölgəsinin kənd təsərrüfatı sahələrində çalışan hər bir fermerimiz üçün gübrə.az geniş xidmətlər təqdim edir.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-gray-900">
                · Məhsullarımız Bütün Fermerlərimiz Üçün Əlçatandır
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Azərbaycanın füsunkar təbiəti və kənd təsərrüfatı sektoru üzrə dövlət səviyyəsində həyata keçirilən müxtəlif tədbirlər planları fermerlərimizə yaşadıqları bölgələrdən asılı olmayaraq, kənd təsərrüfatı sahələrini becərmək üçün əlverişli şərait yaradır.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-gray-900">
                · Hər Bir Fermerin Büdcəsinə Uyğun
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                gübrə.az təsərrüfat sahibləri üçün zəruri olan yüksək keyfiyyətli toxum, gübrə, pestisid çeşidləri, müasir əkin ləvazimatları və s. kimi bütün növ kənd təsərrüfatı məhsullarının, vasitələrinin münasib qiymətlərlə satışını həyata keçirir.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-gray-900">
                · Peşəkar Komandamızla Daim Xidmətinizdəyik
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Fəaliyyətə başladığı dövrdən etibarən, ölkəmizdə kənd təsərrüfatının inkişafına uğurlu töhfələrini verməyə davam edən gübrə.az aqrar ticarət şəbəkəsi müxtəlif regionlarda yerləşən 200-dən çox satış nöqtəsi ilə daim fermerlərin xidmətindədir.
              </p>
            </div>
          </motion.div>

          {/* Services Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <div className="text-center p-6">
              <h3 className="font-semibold text-gray-900">▪ Gübrə satışı ▪</h3>
            </div>
            <div className="text-center p-6">
              <h3 className="font-semibold text-gray-900">▪ Aqronom Məsləhəti ▪</h3>
            </div>
            <div className="text-center p-6">
              <h3 className="font-semibold text-gray-900">▪ Torpaq Analizi ▪</h3>
            </div>
            <div className="text-center p-6">
              <h3 className="font-semibold text-gray-900">▪ Subsidiya ilə Satış ▪</h3>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

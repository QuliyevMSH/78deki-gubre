import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4"
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Haqqımızda
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Fermerin Ehtiyacı Olan Hər Şey Bir Mərkəzdə!
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Zəhmətkeş Fermerlər Üçün Yüksək Səviyyəli Xidmət
              </h2>
              <p className="text-gray-600">
                Ölkəmizin ucqar, dağətəyi rayonlarından tutmuş, istənilən bölgəsinin kənd təsərrüfatı sahələrində çalışan hər bir fermerimiz üçün gübrə.az geniş xidmətlər təqdim edir.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Məhsullarımız Bütün Fermerlərimiz Üçün Əlçatandır
              </h2>
              <p className="text-gray-600">
                Azərbaycanın füsunkar təbiəti və kənd təsərrüfatı sektoru üzrə dövlət səviyyəsində həyata keçirilən müxtəlif tədbirlər planları fermerlərimizə yaşadıqları bölgələrdən asılı olmayaraq, kənd təsərrüfatı sahələrini becərmək üçün əlverişli şərait yaradır.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Hər Bir Fermerin Büdcəsinə Uyğun
              </h2>
              <p className="text-gray-600">
                gübrə.az təsərrüfat sahibləri üçün zəruri olan yüksək keyfiyyətli toxum, gübrə, pestisid çeşidləri, müasir əkin ləvazimatları və s. kimi bütün növ kənd təsərrüfatı məhsullarının, vasitələrinin münasib qiymətlərlə satışını həyata keçirir.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Peşəkar Komandamızla Daim Xidmətinizdəyik
              </h2>
              <p className="text-gray-600">
                Fəaliyyətə başladığı dövrdən etibarən, ölkəmizdə kənd təsərrüfatının inkişafına uğurlu töhfələrini verməyə davam edən gübrə.az aqrar ticarət şəbəkəsi müxtəlif regionlarda yerləşən 200-dən çox satış nöqtəsi ilə daim fermerlərin xidmətindədir.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="text-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900">Gübrə satışı</h3>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900">Aqronom Məsləhəti</h3>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900">Torpaq Analizi</h3>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900">Subsidiya ilə Satış</h3>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
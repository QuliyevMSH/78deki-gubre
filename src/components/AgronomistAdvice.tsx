import { HelpCircle } from 'lucide-react';

export const AgronomistAdvice = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-primary/5 to-primary/10">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary">AQRONOM MƏSLƏHƏTİ</h2>
        
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start gap-4">
              <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-primary mb-4">
                  Gübrə verərkən nələri nəzərə almalıyam?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Bitkilərə gübrə verərkən torpağın tipi, əkiləcək bitkinin sələfi, bitkinin vegetasiya müddətində hansı qida maddələrinə ehtiyac duyacağı mütləq nəzərə alınmalıdır. İlk öncə torpaq analiz olunmalı və bitkinin vegetasiya(torpağa əkin və son məhsulun yığılması müddəti) dövründə hansı həcmdə qida maddələri ilə təmin olunması müəyyən olunduqdan sonra torpaqda çatışmayan elementlər əlavə gübrələmə kimi verilməlidir. Bitkiyə həddindən artıq gübrə verdikdə bitki köklərində əmici tellər yanır, bitki cılızlaşır, qida maddələrinin toplanmasına və məhsuldarlığın aşağı düşərək bitkinin inkişafdan qalmasına səbəb olur.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start gap-4">
              <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-primary mb-4">
                  Meyvə ağaclarına hansı gübrələri vermək məsləhətdir?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Meyvə ağaclarına adətən Nitroammofoska gübrəsinin verilməsi tövsiyə edilir. Yaşı 5 ilə qədər olan ağaclar üçün hər ağaca 100 qram, yaşı 5 ildən çox olan ağaclar üçün isə hər ağaca 150 qram Nitroammofoska verilir. Gübrə ağacın 1 metr diametri üzrə səpilir, daha sonra sulanır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
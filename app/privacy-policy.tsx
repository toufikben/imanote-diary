import { ScrollView, StyleSheet, Text, View } from "react-native";

const policySections = [
  {
    language: "العربية",
    direction: "rtl" as const,
    title: "سياسة خصوصية Private Diary",
    intro: "تاريخ النفاذ: 14 أغسطس 2026",
    paragraphs: [
      "Private Diary تطبيق مذكرات محلي أولاً. لا ينشئ حسابات مستخدمين، ولا يقدم مزامنة سحابية، ولا يرسل محتوى اليوميات إلى خادم تابع للتطبيق.",
      "تبقى المذكرات والنصوص والصور والملاحظات الصوتية والرسومات والإعدادات على جهازك. عند اختيار تصدير نسخة احتياطية مشفّرة أو مشاركتها، يتم ذلك عبر أدوات نظام جهازك وبقرار منك.",
      "يستخدم التطبيق الميكروفون فقط عند بدء تسجيل ملاحظة صوتية، والصور أو الوسائط فقط عند اختيار مرفق، والإشعارات فقط عند تفعيل تذكير يومي محلي. تستخدم البصمة أو الوجه اختيارياً عبر نظام التشغيل؛ لا يصل التطبيق إلى البيانات أو القوالب البيومترية.",
      "يمكنك حذف الذكريات من التطبيق أو إجراء مسح محلي مؤكد للذكريات والوسائط والإعدادات والقفل المحفوظ. احذف أيضاً أي نسخة احتياطية صدّرتها إذا أردت إزالتها.",
      "لا يحتوي التطبيق على إعلانات أو تحليلات أو شراء داخل التطبيق أو خدمة معالجة خارجية. إذا أضيفت أي من هذه الميزات مستقبلاً، ستُحدّث هذه السياسة وإفصاحات Google Play قبل طرح النسخة الجديدة.",
      "للحصول على الدعم أو الاستفسار عن الخصوصية، استخدم عنوان البريد الظاهر في صفحة Private Diary على Google Play.",
    ],
  },
  {
    language: "English",
    direction: "ltr" as const,
    title: "Private Diary Privacy Policy",
    intro: "Effective date: 14 August 2026",
    paragraphs: [
      "Private Diary is a local-first diary application. It does not create user accounts, provide cloud synchronization, or transmit diary content to an application-controlled server.",
      "Diary entries, text, photos, voice notes, drawings, and settings remain on your device. If you choose to export or share an encrypted backup, that action is performed through your device’s system tools and at your direction.",
      "The app uses the microphone only when you start recording a voice note, photos or media only when you select an attachment, and notifications only for an enabled local daily reminder. Optional biometric unlock is handled by your operating system; the app does not access biometric data or templates.",
      "You may delete individual memories in the app or use the confirmed local wipe to remove stored memories, media, settings, and lock credentials. You should also delete any backup you exported if you wish to remove it.",
      "The app contains no advertising, analytics, in-app purchases, or external processing service. If any such capability is added in the future, this policy and the related Google Play disclosures will be updated before that version is released.",
      "For support or privacy questions, please use the contact email displayed on the Private Diary Google Play listing.",
    ],
  },
  {
    language: "Français",
    direction: "ltr" as const,
    title: "Politique de confidentialité de Private Diary",
    intro: "Date d’effet : 14 août 2026",
    paragraphs: [
      "Private Diary est une application de journal intime conçue d’abord pour un usage local. Elle ne crée aucun compte utilisateur, ne propose aucune synchronisation cloud et ne transmet pas le contenu des journaux à un serveur contrôlé par l’application.",
      "Les entrées, textes, photos, notes vocales, dessins et réglages restent sur votre appareil. Si vous choisissez d’exporter ou de partager une sauvegarde chiffrée, cette action s’effectue avec les outils du système de votre appareil et selon votre choix.",
      "L’application utilise le microphone uniquement pendant l’enregistrement d’une note vocale, les photos ou médias uniquement lors du choix d’une pièce jointe et les notifications uniquement pour un rappel quotidien local activé. Le déverrouillage biométrique facultatif est géré par le système d’exploitation ; l’application n’accède ni aux données biométriques ni aux modèles.",
      "Vous pouvez supprimer des souvenirs dans l’application ou utiliser l’effacement local confirmé afin de retirer les souvenirs, médias, réglages et identifiants de verrouillage stockés. Supprimez aussi toute sauvegarde que vous avez exportée si vous souhaitez l’effacer.",
      "L’application ne contient ni publicité, ni analytique, ni achat intégré, ni service de traitement externe. Si une telle fonction est ajoutée à l’avenir, cette politique et les déclarations Google Play correspondantes seront mises à jour avant la publication.",
      "Pour toute demande d’assistance ou question de confidentialité, utilisez l’adresse e-mail de contact affichée sur la fiche Google Play de Private Diary.",
    ],
  },
];

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.brand}>Private Diary</Text>
        <Text style={styles.subtitle}>Privacy Policy · سياسة الخصوصية · Politique de confidentialité</Text>
      </View>
      {policySections.map((section) => (
        <View key={section.language} style={styles.section}>
          <Text style={[styles.language, { textAlign: section.direction === "rtl" ? "right" : "left" }]}>{section.language}</Text>
          <Text style={[styles.title, { textAlign: section.direction === "rtl" ? "right" : "left" }]}>{section.title}</Text>
          <Text style={[styles.effective, { textAlign: section.direction === "rtl" ? "right" : "left" }]}>{section.intro}</Text>
          {section.paragraphs.map((paragraph) => <Text key={paragraph} style={[styles.paragraph, { textAlign: section.direction === "rtl" ? "right" : "left", writingDirection: section.direction }]}>{paragraph}</Text>)}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#FFF8FC" },
  content: { width: "100%", maxWidth: 860, alignSelf: "center", paddingHorizontal: 22, paddingVertical: 38, gap: 20 },
  hero: { backgroundColor: "#F8DFE9", borderRadius: 24, padding: 24, borderWidth: 1, borderColor: "#E6B3C5", gap: 8 },
  brand: { color: "#7A2447", fontSize: 30, lineHeight: 38, fontWeight: "800" },
  subtitle: { color: "#9B4C6B", fontSize: 14, lineHeight: 20, fontWeight: "600" },
  section: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 22, borderWidth: 1, borderColor: "#F0D6E0", gap: 12 },
  language: { color: "#A64F72", fontSize: 13, lineHeight: 18, fontWeight: "800", textTransform: "uppercase" },
  title: { color: "#3B1A28", fontSize: 22, lineHeight: 30, fontWeight: "800" },
  effective: { color: "#795965", fontSize: 13, lineHeight: 19, fontWeight: "600", marginBottom: 3 },
  paragraph: { color: "#4A3340", fontSize: 16, lineHeight: 25 },
});

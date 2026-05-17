import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext({})

export const translations = {
  en: {
    // Header
    home: 'Home', about: 'About', profile: 'Profile', signIn: 'Sign In', signOut: 'Sign Out',
    // Landing
    tagline: "Madurai's Premium Real Estate Platform",
    heroTitle1: 'Manai', heroTitle2: 'Mitra',
    heroSubtitle: 'Discover, list, and invest in premium plots across all divisions of Madurai district. Your trusted partner for seamless property transactions.',
    browseAsBuyer: 'Browse as Buyer', listAsSeller: 'List as Seller',
    divisions: 'Divisions', locations: 'Locations', plotsListed: 'Plots Listed', verified: 'Verified',
    chooseYourPath: 'Choose Your Path', buyerSellerDesc: 'Whether you\'re looking to buy or sell, we have you covered.',
    buyer: 'Buyer', seller: 'Seller',
    buyerDesc: 'Browse plots across 5 Madurai divisions. Explore by area, compare prices, and find your dream plot.',
    sellerDesc: 'List your property with details and documents. Owner-verified listings reach genuine buyers.',
    explore: 'Explore →', startListing: 'Start Listing →',
    whyManaiMitra: 'Why Manai Mitra?',
    aiVerification: 'AI Verification', aiVerificationDesc: 'Every listing passes through our AI pipeline for authenticity checks before approval.',
    secureAuth: 'Secure Auth', secureAuthDesc: 'Google and email authentication ensures only verified users can list and transact.',
    localExpertise: 'Local Expertise', localExpertiseDesc: 'Deep coverage of all 5 Madurai divisions with 50+ neighbourhoods mapped.',
    ownerApproved: 'Owner Approved', ownerApprovedDesc: 'Every listing is personally reviewed by our team before going live.',
    // Buyer
    exploreDivisions: 'Explore Madurai Divisions',
    selectDivision: 'Select a division to browse available plots in that area',
    exploreAreas: 'Explore 10 areas →',
    back: '← Back', backToDivisions: '← Back to Divisions', backToPlaces: '← Back to Places', backToPlots: '← Back to Plots',
    viewPlots: 'View plots →',
    availablePlots: 'Available Plots',
    noPlots: 'No approved plots in this area yet.',
    area: 'Area', price: 'Price', type: 'Type', location: 'Location',
    viewDetails: 'View Details →',
    interestedWhatsApp: "I'm Interested — Chat on WhatsApp",
    contactOwner: 'Contact Owner',
    landPhotos: 'Land Photos', landLocation: 'Land Location',
    dtcpApproved: 'DTCP Approved', dtcpYes: 'Yes ✅', dtcpNo: 'No ❌',
    pricePerSqft: 'Price/Sq.ft', totalPrice: 'Total Price', sqft: 'sq.ft',
    buyerPrivacyNote: '📌 For seller contact details, please reach our team via WhatsApp.',
    approved: 'Approved', pending: 'Pending Approval', rejected: 'Rejected',
    // Seller
    sellerFormTitle: 'List Your Property',
    basicDetails: 'Basic Details', landDetails: 'Land Details', documents: 'Documents', photos: 'Photos',
    ownerName: 'Owner Name', phone: 'Phone Number', address: 'Address',
    landTitle: 'Land Title / Plot Name', division: 'Division', place: 'Place',
    landArea: 'Land Area (sq.ft)', askingPrice: 'Asking Price (₹)', plotType: 'Plot Type',
    pattaNumber: 'Patta Number', chittaNumber: 'Chitta Number',
    dtcpApprovedQ: 'Is DTCP Approved?', yes: 'Yes', no: 'No',
    uploadDocs: 'Upload Documents (Patta, Pathiram copies)',
    uploadLandPhotos: 'Upload Land Photos (visible to buyers)',
    submitForApproval: 'Submit for Owner Approval',
    submittedSuccess: '✅ Submitted! The owner will review and approve your listing.',
    // Dashboard
    myListings: 'My Listings', editListing: 'Edit', noListings: 'No listings yet.',
    // Admin
    allSubmissions: 'All Submissions', approveBtn: 'Approve ✅', rejectBtn: 'Reject ❌',
    pendingApproval: 'Pending Approval', approvedListings: 'Approved', rejectedListings: 'Rejected',
    fullDetails: 'Full Details', patta: 'Patta No.', chitta: 'Chitta No.',
    // Auth
    createAccount: 'Create Account', signInTitle: 'Sign In',
    emailAddress: 'Email Address', password: 'Password', minChars: 'Min 6 characters',
    alreadyHaveAccount: 'Already have an account? Sign In',
    dontHaveAccount: "Don't have an account? Create one",
    joinAs: 'Join as', browseAndFind: 'Browse & find plots', listYourProperty: 'List your property',
    pleaseWait: 'Please wait...', goBack: '← Go Back',
  },
  ta: {
    // Header
    home: 'முகப்பு', about: 'எங்களை பற்றி', profile: 'சுயவிவரம்', signIn: 'உள்நுழைக', signOut: 'வெளியேறு',
    // Landing
    tagline: 'மதுரையின் சிறந்த ரியல் எஸ்டேட் தளம்',
    heroTitle1: 'மனை', heroTitle2: 'மித்ரா',
    heroSubtitle: 'மதுரை மாவட்டத்தின் அனைத்து பிரிவுகளிலும் சிறந்த மனைகளை கண்டறியுங்கள், பட்டியலிடுங்கள், முதலீடு செய்யுங்கள்.',
    browseAsBuyer: 'வாங்குபவராக உலவுங்கள்', listAsSeller: 'விற்பனையாளராக பட்டியலிடுங்கள்',
    divisions: 'பிரிவுகள்', locations: 'இடங்கள்', plotsListed: 'பட்டியலிடப்பட்ட மனைகள்', verified: 'சரிபார்க்கப்பட்டது',
    chooseYourPath: 'உங்கள் பாதையை தேர்ந்தெடுங்கள்', buyerSellerDesc: 'வாங்க அல்லது விற்க — நாங்கள் உங்களுக்கு உதவுவோம்.',
    buyer: 'வாங்குபவர்', seller: 'விற்பனையாளர்',
    buyerDesc: 'மதுரையின் 5 பிரிவுகளில் மனைகளை உலவுங்கள். பகுதி வாரியாக ஆராயுங்கள், விலைகளை ஒப்பிட்டு உங்கள் கனவு மனையை கண்டறியுங்கள்.',
    sellerDesc: 'உங்கள் சொத்தை விவரங்கள் மற்றும் ஆவணங்களுடன் பட்டியலிடுங்கள். உரிமையாளர் சரிபார்க்கப்பட்ட பட்டியல்கள் உண்மையான வாங்குபவர்களை சென்றடையும்.',
    explore: 'ஆராயுங்கள் →', startListing: 'பட்டியல் தொடங்குங்கள் →',
    whyManaiMitra: 'மனை மித்ரா ஏன்?',
    aiVerification: 'AI சரிபார்ப்பு', aiVerificationDesc: 'ஒவ்வொரு பட்டியலும் ஒப்புதலுக்கு முன் AI மூலம் சரிபார்க்கப்படுகிறது.',
    secureAuth: 'பாதுகாப்பான அங்கீகாரம்', secureAuthDesc: 'Google மற்றும் மின்னஞ்சல் மூலம் சரிபார்க்கப்பட்ட பயனர்கள் மட்டுமே பட்டியலிட முடியும்.',
    localExpertise: 'உள்ளூர் நிபுணத்துவம்', localExpertiseDesc: 'மதுரையின் அனைத்து 5 பிரிவுகளிலும் 50+ பகுதிகளின் முழு தகவல்.',
    ownerApproved: 'உரிமையாளர் ஒப்புதல்', ownerApprovedDesc: 'ஒவ்வொரு பட்டியலும் நேரில் எங்கள் குழுவால் மதிப்பாய்வு செய்யப்படும்.',
    // Buyer
    exploreDivisions: 'மதுரை பிரிவுகளை ஆராயுங்கள்',
    selectDivision: 'கிடைக்கும் மனைகளை பார்க்க ஒரு பிரிவை தேர்ந்தெடுங்கள்',
    exploreAreas: '10 பகுதிகளை ஆராயுங்கள் →',
    back: '← பின்', backToDivisions: '← பிரிவுகளுக்கு திரும்பு', backToPlaces: '← இடங்களுக்கு திரும்பு', backToPlots: '← மனைகளுக்கு திரும்பு',
    viewPlots: 'மனைகளை பார்க்கவும் →',
    availablePlots: 'கிடைக்கும் மனைகள்',
    noPlots: 'இந்த பகுதியில் இன்னும் ஒப்புதல் மனைகள் இல்லை.',
    area: 'பரப்பளவு', price: 'விலை', type: 'வகை', location: 'இடம்',
    viewDetails: 'விவரங்களை பார்க்கவும் →',
    interestedWhatsApp: 'எனக்கு ஆர்வம் உள்ளது — WhatsApp-ல் பேசுங்கள்',
    contactOwner: 'உரிமையாளரை தொடர்புகொள்ளுங்கள்',
    landPhotos: 'மனை புகைப்படங்கள்', landLocation: 'மனை இடம்',
    dtcpApproved: 'DTCP ஒப்புதல்', dtcpYes: 'ஆம் ✅', dtcpNo: 'இல்லை ❌',
    pricePerSqft: 'சதுர அடிக்கு விலை', totalPrice: 'மொத்த விலை', sqft: 'சதுர அடி',
    buyerPrivacyNote: '📌 விற்பனையாளர் தொடர்பு விவரங்களுக்கு, WhatsApp மூலம் எங்கள் குழுவை தொடர்புகொள்ளுங்கள்.',
    approved: 'ஒப்புதல் பெற்றது', pending: 'ஒப்புதல் நிலுவையில்', rejected: 'நிராகரிக்கப்பட்டது',
    // Seller
    sellerFormTitle: 'உங்கள் சொத்தை பட்டியலிடுங்கள்',
    basicDetails: 'அடிப்படை விவரங்கள்', landDetails: 'நில விவரங்கள்', documents: 'ஆவணங்கள்', photos: 'புகைப்படங்கள்',
    ownerName: 'உரிமையாளர் பெயர்', phone: 'தொலைபேசி எண்', address: 'முகவரி',
    landTitle: 'நில தலைப்பு / மனை பெயர்', division: 'பிரிவு', place: 'இடம்',
    landArea: 'நில பரப்பளவு (சதுர அடி)', askingPrice: 'கேட்கும் விலை (₹)', plotType: 'மனை வகை',
    pattaNumber: 'பட்டா எண்', chittaNumber: 'சிட்டா எண்',
    dtcpApprovedQ: 'DTCP ஒப்புதல் உள்ளதா?', yes: 'ஆம்', no: 'இல்லை',
    uploadDocs: 'ஆவணங்களை பதிவேற்றுங்கள் (பட்டா, பதிரம் நகல்கள்)',
    uploadLandPhotos: 'நில புகைப்படங்களை பதிவேற்றுங்கள் (வாங்குபவர்களுக்கு தெரியும்)',
    submitForApproval: 'உரிமையாளர் ஒப்புதலுக்கு சமர்ப்பிக்கவும்',
    submittedSuccess: '✅ சமர்ப்பிக்கப்பட்டது! உரிமையாளர் மதிப்பாய்வு செய்து ஒப்புதல் அளிப்பார்.',
    // Dashboard
    myListings: 'என் பட்டியல்கள்', editListing: 'திருத்து', noListings: 'இன்னும் பட்டியல்கள் இல்லை.',
    // Admin
    allSubmissions: 'அனைத்து சமர்ப்பிப்புகள்', approveBtn: 'ஒப்புதல் ✅', rejectBtn: 'நிராகரி ❌',
    pendingApproval: 'ஒப்புதல் நிலுவையில்', approvedListings: 'ஒப்புதல் பெற்றவை', rejectedListings: 'நிராகரிக்கப்பட்டவை',
    fullDetails: 'முழு விவரங்கள்', patta: 'பட்டா எண்.', chitta: 'சிட்டா எண்.',
    // Auth
    createAccount: 'கணக்கை உருவாக்குங்கள்', signInTitle: 'உள்நுழைக',
    emailAddress: 'மின்னஞ்சல் முகவரி', password: 'கடவுச்சொல்', minChars: 'குறைந்தது 6 எழுத்துகள்',
    alreadyHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக',
    dontHaveAccount: 'கணக்கு இல்லையா? உருவாக்குங்கள்',
    joinAs: 'இவராக சேருங்கள்', browseAndFind: 'மனைகளை உலவுங்கள்', listYourProperty: 'உங்கள் சொத்தை பட்டியலிடுங்கள்',
    pleaseWait: 'தயவுசெய்து காத்திருங்கள்...', goBack: '← திரும்பு',
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('mm_lang') || 'en')

  const toggleLang = () => {
    const next = lang === 'en' ? 'ta' : 'en'
    setLang(next)
    localStorage.setItem('mm_lang', next)
  }

  const t = (key) => translations[lang][key] || translations['en'][key] || key

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)

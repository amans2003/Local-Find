const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const locs = (arr) => arr.map((n) => ({ name: n, slug: slug(n), isActive: true }));

const INDIA_LOCATIONS = [

  // ════════════════════════════════════════════════
  //  ANDHRA PRADESH
  // ════════════════════════════════════════════════
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', subLocations: locs(['Gajuwaka', 'MVP Colony', 'Rushikonda', 'Seethammadhara', 'Steel Plant Area', 'Madhurawada', 'Dwaraka Nagar', 'Siripuram']) },
  { name: 'Vijayawada', state: 'Andhra Pradesh', subLocations: locs(['Benz Circle', 'Governorpet', 'Labbipet', 'MG Road', 'Patamata', 'Suryaraopet', 'Auto Nagar', 'Machavaram']) },
  { name: 'Guntur', state: 'Andhra Pradesh', subLocations: locs(['Brodipet', 'Arundelpet', 'Naaz Centre', 'Lakshmipuram', 'Koritepadu', 'Amaravathi Road']) },
  { name: 'Tirupati', state: 'Andhra Pradesh', subLocations: locs(['Alipiri', 'Balaji Nagar', 'Renigunta', 'SV University Area', 'Tiruchanur', 'Kapila Theertham']) },
  { name: 'Kakinada', state: 'Andhra Pradesh', subLocations: locs(['Main Road', 'Suryaraopet', 'Rajupalem', 'Gandhinagar', 'Surampalem']) },
  { name: 'Rajahmundry', state: 'Andhra Pradesh', subLocations: locs(['Innispet', 'T. Nagar', 'Bhanugudi Junction', 'Morampudi', 'Danavaipeta']) },
  { name: 'Kurnool', state: 'Andhra Pradesh', subLocations: locs(['Bellary Road', 'Budhawarpet', 'Fort Area', 'Srinivasa Nagar', 'Old Town']) },
  { name: 'Nellore', state: 'Andhra Pradesh', subLocations: locs(['Magunta Layout', 'Pogathota', 'Grand Trunk Road', 'Dargamitta', 'Krishnapuram']) },
  { name: 'Eluru', state: 'Andhra Pradesh', subLocations: locs(['Powerpet', 'Satyanarayanapuram', 'R.R. Pet', 'Jyothinagar', 'Ramaraopet']) },
  { name: 'Anantapur', state: 'Andhra Pradesh', subLocations: locs(['Subash Road', 'Old Town', 'New Town', 'Srinivasa Nagar', 'Hindupur Road']) },
  { name: 'Kadapa', state: 'Andhra Pradesh', subLocations: locs(['Gandhi Nagar', 'YSR Nagar', 'Khajipet Road', 'New Colony', 'Station Road']) },
  { name: 'Ongole', state: 'Andhra Pradesh', subLocations: locs(['K.R. Peta', 'Inkollu Road', 'Nagulapalli', 'P.N. Peta', 'Market Centre']) },
  { name: 'Chittoor', state: 'Andhra Pradesh', subLocations: locs(['Anna Nagar', 'Padmavathi Colony', 'New Bus Stand Area', 'Venkateswara Colony']) },
  { name: 'Srikakulam', state: 'Andhra Pradesh', subLocations: locs(['Balaga', 'Amadalavalasa', 'Narasannapeta', 'Palasa', 'Station Road']) },
  { name: 'Vizianagaram', state: 'Andhra Pradesh', subLocations: locs(['Main Road', 'Kothavalasa', 'Gandhi Nagar', 'Poorna Market', 'Fort Area']) },
  { name: 'Machilipatnam', state: 'Andhra Pradesh', subLocations: locs(['Gandhi Nagar', 'Bandar Road', 'Kotha Peta', 'Agraharam', 'Beach Road']) },

  // ════════════════════════════════════════════════
  //  ARUNACHAL PRADESH
  // ════════════════════════════════════════════════
  { name: 'Itanagar', state: 'Arunachal Pradesh', subLocations: locs(['Naharlagun', 'Nirjuli', 'Banderdewa', 'Ganga Market', 'Chimpu']) },
  { name: 'Pasighat', state: 'Arunachal Pradesh', subLocations: locs(['Main Market', 'Old Market', 'Daying Ering Area', 'Ramakrishna Nagar']) },
  { name: 'Aalo', state: 'Arunachal Pradesh', subLocations: locs(['Town Area', 'Yomcha', 'Siyum', 'Kamba', 'Liromoba']) },

  // ════════════════════════════════════════════════
  //  ASSAM
  // ════════════════════════════════════════════════
  { name: 'Guwahati', state: 'Assam', subLocations: locs(['Dispur', 'Paltan Bazar', 'Fancy Bazar', 'Geetanagar', 'Ulubari', 'Six Mile', 'VIP Road', 'Kahilipara', 'Bharalumukh', 'Narengi']) },
  { name: 'Silchar', state: 'Assam', subLocations: locs(['Tarapur', 'Shillong Patty', 'Rangirkhari', 'Link Road', 'Premtala', 'Meherpur']) },
  { name: 'Dibrugarh', state: 'Assam', subLocations: locs(['AT Road', 'Thana Chariali', 'Naharkatia', 'Chabua', 'Barbarua']) },
  { name: 'Jorhat', state: 'Assam', subLocations: locs(['AT Road', 'Cinnamara', 'Titabor', 'Dergaon', 'Mariani']) },
  { name: 'Tezpur', state: 'Assam', subLocations: locs(['KC Road', 'Mission Charali', 'Dekargaon', 'Bihaguri', 'Napaam']) },
  { name: 'Nagaon', state: 'Assam', subLocations: locs(['Dobhoja', 'Haibargaon', 'Pub Nagaon', 'Hojai', 'Lumding']) },
  { name: 'Tinsukia', state: 'Assam', subLocations: locs(['Digboi', 'Doom Dooma', 'Margherita', 'Doomdooma', 'Makum']) },
  { name: 'Bongaigaon', state: 'Assam', subLocations: locs(['New Bongaigaon', 'Abhayapuri', 'Bijni', 'Salakati', 'Dangtola']) },
  { name: 'Karimganj', state: 'Assam', subLocations: locs(['Main Road', 'Ramnagar', 'Kalain', 'Badarpur', 'Jiribam']) },
  { name: 'Sivsagar', state: 'Assam', subLocations: locs(['AT Road', 'Nazira', 'Demow', 'Amguri', 'Sonari']) },

  // ════════════════════════════════════════════════
  //  BIHAR
  // ════════════════════════════════════════════════
  { name: 'Patna', state: 'Bihar', subLocations: locs(['Boring Road', 'Kankarbagh', 'Bailey Road', 'Danapur', 'Rajendra Nagar', 'Patna City', 'Kurji', 'Ashok Raj Path', 'Gandhi Maidan', 'Phulwari Sharif']) },
  { name: 'Gaya', state: 'Bihar', subLocations: locs(['Bodh Gaya', 'Manpur', 'Tekari', 'Sher Ghati', 'Wazirganj']) },
  { name: 'Bhagalpur', state: 'Bihar', subLocations: locs(['Khalifabag', 'Adampur', 'Nathnagar', 'Barari', 'Sabour', 'Kahalgaon']) },
  { name: 'Muzaffarpur', state: 'Bihar', subLocations: locs(['Brahmpura', 'Mithanpura', 'Saraiyaganj', 'Juran Chapra', 'Motijheel', 'Ahiyapur']) },
  { name: 'Darbhanga', state: 'Bihar', subLocations: locs(['Laheriasarai', 'Benta', 'Singhwara', 'Kusheshwar Asthan', 'Biraul']) },
  { name: 'Begusarai', state: 'Bihar', subLocations: locs(['Teghra', 'Barauni', 'Birpur', 'Sahebpur Kamal', 'Bachhwara']) },
  { name: 'Purnia', state: 'Bihar', subLocations: locs(['New Area', 'Line Bazar', 'Kasba', 'Bhatta Bazar', 'Banmankhi']) },
  { name: 'Arrah', state: 'Bihar', subLocations: locs(['Main Road', 'Ramgarhwa', 'Garhani', 'Koilwar', 'Jagdishpur']) },
  { name: 'Sitamarhi', state: 'Bihar', subLocations: locs(['Bairgania', 'Pupri', 'Sheohar', 'Riga', 'Sonbarsa']) },
  { name: 'Chapra', state: 'Bihar', subLocations: locs(['Donapur', 'Revelganj', 'Dighwara', 'Parsa', 'Ekma']) },
  { name: 'Bihar Sharif', state: 'Bihar', subLocations: locs(['Old Nagar', 'Nalanda', 'Hilsa', 'Rajgir', 'Pawapuri']) },
  { name: 'Munger', state: 'Bihar', subLocations: locs(['Lal Darwaja', 'Jagannath Mandir Road', 'Kastahari', 'Jamalpur', 'Kiul']) },
  { name: 'Katihar', state: 'Bihar', subLocations: locs(['Station Road', 'Manihari', 'Barsoi', 'Amdabad', 'Korha']) },
  { name: 'Samastipur', state: 'Bihar', subLocations: locs(['Dalsingh Sarai', 'Pusa', 'Mohiuddin Nagar', 'Bibhutibhushan', 'Singhia']) },
  { name: 'Hajipur', state: 'Bihar', subLocations: locs(['Vaishali', 'Lalganj', 'Mahnar', 'Raghunathpur', 'EPIP Zone']) },

  // ════════════════════════════════════════════════
  //  CHHATTISGARH
  // ════════════════════════════════════════════════
  { name: 'Raipur', state: 'Chhattisgarh', subLocations: locs(['Shankar Nagar', 'Pandri', 'Telibandha', 'Devendra Nagar', 'Avanti Vihar', 'GE Road', 'Tatibandh', 'Civil Lines']) },
  { name: 'Bhilai', state: 'Chhattisgarh', subLocations: locs(['Sector 1', 'Sector 6', 'Durg', 'Supela', 'Kohka', 'Smriti Nagar', 'Nehru Nagar']) },
  { name: 'Bilaspur', state: 'Chhattisgarh', subLocations: locs(['Vyapam Chowk', 'Sadar Bazar', 'Malviya Nagar', 'Link Road', 'Torwa', 'Sarkanda']) },
  { name: 'Durg', state: 'Chhattisgarh', subLocations: locs(['Old Durg', 'New Colony', 'Moti Bagh', 'Vaishali Nagar', 'Risali']) },
  { name: 'Korba', state: 'Chhattisgarh', subLocations: locs(['NTPC Area', 'Urga', 'Deepika', 'Balco Nagar', 'City Kotwali']) },
  { name: 'Rajnandgaon', state: 'Chhattisgarh', subLocations: locs(['Main Road', 'Dongargarh', 'Khairagarh', 'Kawardha', 'Dongargaon']) },
  { name: 'Raigarh', state: 'Chhattisgarh', subLocations: locs(['Gandhi Nagar', 'Power House Road', 'Sarangarh', 'Gharghoda', 'Kharsia']) },
  { name: 'Ambikapur', state: 'Chhattisgarh', subLocations: locs(['Gandhi Chowk', 'Medical College Road', 'Baikunthpur', 'Surajpur', 'Manendragarh']) },
  { name: 'Jagdalpur', state: 'Chhattisgarh', subLocations: locs(['Dharampura', 'Maharani Road', 'Baster', 'Kondagaon', 'Dantewada']) },

  // ════════════════════════════════════════════════
  //  GOA
  // ════════════════════════════════════════════════
  { name: 'Panaji', state: 'Goa', subLocations: locs(['Miramar', 'Dona Paula', 'Porvorim', 'Taleigao', 'Campal', 'Ribandar']) },
  { name: 'Margao', state: 'Goa', subLocations: locs(['Fatorda', 'Benaulim', 'Colva', 'Navelim', 'Aquem', 'Monte Hill']) },
  { name: 'Vasco da Gama', state: 'Goa', subLocations: locs(['Mormugao', 'Bogmalo', 'Chicalim', 'Sancoale', 'Dabolim']) },
  { name: 'Mapusa', state: 'Goa', subLocations: locs(['Calangute', 'Anjuna', 'Vagator', 'Parra', 'Siolim']) },
  { name: 'Ponda', state: 'Goa', subLocations: locs(['Farmagudi', 'Tisk', 'Curti', 'Priol', 'Bandora']) },

  // ════════════════════════════════════════════════
  //  GUJARAT
  // ════════════════════════════════════════════════
  { name: 'Ahmedabad', state: 'Gujarat', subLocations: locs(['Navrangpura', 'Satellite', 'Vastrapur', 'Maninagar', 'Bopal', 'SG Road', 'Prahlad Nagar', 'Chandkheda', 'Gota', 'Thaltej', 'Isanpur', 'Narol']) },
  { name: 'Surat', state: 'Gujarat', subLocations: locs(['Vesu', 'Athwa', 'Adajan', 'Katargam', 'Rander', 'Udhna', 'Varachha', 'Althan', 'Pal', 'Dumas']) },
  { name: 'Vadodara', state: 'Gujarat', subLocations: locs(['Alkapuri', 'Gotri', 'Fatehgunj', 'Manjalpur', 'Subhanpura', 'Waghodia Road', 'Akota', 'Karelibaug']) },
  { name: 'Rajkot', state: 'Gujarat', subLocations: locs(['Kalawad Road', 'Gondal Road', 'Bhakti Nagar', '150 Feet Ring Road', 'University Road', 'Mavdi', 'Kothariya']) },
  { name: 'Gandhinagar', state: 'Gujarat', subLocations: locs(['Sector 1', 'Sector 7', 'Sector 11', 'Sector 21', 'Infocity', 'Kudasan']) },
  { name: 'Bhavnagar', state: 'Gujarat', subLocations: locs(['Waghawadi Road', 'Crescent Circle', 'Kalanala', 'Nilambag', 'Ghogha Road']) },
  { name: 'Jamnagar', state: 'Gujarat', subLocations: locs(['Bedi Gate', 'Park Colony', 'Digvijay Plot', 'Saraswati Nagar', 'Odhav']) },
  { name: 'Junagadh', state: 'Gujarat', subLocations: locs(['Jayshree Plot', 'College Road', 'Choksi Bazar', 'Kalwa Chowk', 'Shasan Road']) },
  { name: 'Gandhidham', state: 'Gujarat', subLocations: locs(['Sector 8', 'Sector 12', 'Adipur', 'Anjar', 'Bhuj']) },
  { name: 'Anand', state: 'Gujarat', subLocations: locs(['Anand Town', 'Vallabh Vidyanagar', 'Karamsad', 'Petlad', 'Borsad']) },
  { name: 'Bharuch', state: 'Gujarat', subLocations: locs(['Station Road', 'Kasak', 'Zadeshwar', 'Ankleshwar', 'Jhagadia']) },
  { name: 'Navsari', state: 'Gujarat', subLocations: locs(['Station Road', 'Vijalpore', 'Dungri', 'Bilimora', 'Gandevi']) },
  { name: 'Valsad', state: 'Gujarat', subLocations: locs(['Vapi', 'Udvada', 'Dharampur', 'Pardi', 'Bulsar Station']) },
  { name: 'Surendranagar', state: 'Gujarat', subLocations: locs(['Wadhwan', 'Limbdi', 'Dasada', 'Chotila', 'Dhrangadhra']) },
  { name: 'Morbi', state: 'Gujarat', subLocations: locs(['Station Road', 'Navagam', 'Tankara', 'Maliya Hatina', 'Wankaner']) },
  { name: 'Mehsana', state: 'Gujarat', subLocations: locs(['Station Road', 'Visnagar', 'Unjha', 'Kadi', 'Patan']) },
  { name: 'Nadiad', state: 'Gujarat', subLocations: locs(['Chaklasi', 'Kheda', 'Balasinor', 'Anand Road', 'Mahudha']) },
  { name: 'Amreli', state: 'Gujarat', subLocations: locs(['Station Road', 'Rajula', 'Savarkundla', 'Bagasara', 'Dhari']) },

  // ════════════════════════════════════════════════
  //  HARYANA
  // ════════════════════════════════════════════════
  { name: 'Gurugram', state: 'Haryana', subLocations: locs(['DLF Cyber City', 'MG Road', 'Sohna Road', 'Golf Course Road', 'Palam Vihar', 'Sector 14', 'Sector 57', 'Udyog Vihar', 'New Colony']) },
  { name: 'Faridabad', state: 'Haryana', subLocations: locs(['NIT', 'Sector 15', 'Sector 16', 'Ballabgarh', 'Old Faridabad', 'Neharpar', 'Greater Faridabad']) },
  { name: 'Ambala', state: 'Haryana', subLocations: locs(['Ambala City', 'Ambala Cantonment', 'Baldev Nagar', 'Model Town', 'Shastri Colony']) },
  { name: 'Panipat', state: 'Haryana', subLocations: locs(['Model Town', 'Sector 11', 'Ansal Sushant City', 'IOCL Refinery', 'Sewah']) },
  { name: 'Hisar', state: 'Haryana', subLocations: locs(['Model Town', 'Sector 14', 'Urban Estate', 'Deegh Road', 'Hansi Road', 'Budh Nagar']) },
  { name: 'Rohtak', state: 'Haryana', subLocations: locs(['Model Town', 'Civil Lines', 'Subhash Nagar', 'PGI Area', 'Asthal Bohar']) },
  { name: 'Karnal', state: 'Haryana', subLocations: locs(['Sector 7', 'Model Town', 'Karan Nagar', 'Taraori', 'Gharaunda']) },
  { name: 'Sonipat', state: 'Haryana', subLocations: locs(['Model Town', 'Sector 14', 'Kundli', 'Gohana', 'Ganaur']) },
  { name: 'Yamunanagar', state: 'Haryana', subLocations: locs(['Jagadhri', 'Model Town', 'Radaur', 'Bilaspur', 'Chhachhrauli']) },
  { name: 'Bhiwani', state: 'Haryana', subLocations: locs(['New Colony', 'Power House Area', 'Subhash Nagar', 'Loharu', 'Dadri']) },
  { name: 'Sirsa', state: 'Haryana', subLocations: locs(['Power House Colony', 'Model Town', 'Dabwali', 'Ellenabad', 'Mandi Dabwali']) },
  { name: 'Rewari', state: 'Haryana', subLocations: locs(['Bawal', 'Dharuhera', 'Kosli', 'Khol', 'Jatusana']) },
  { name: 'Kurukshetra', state: 'Haryana', subLocations: locs(['Thanesar', 'Pehowa', 'Shahabad', 'Ladwa', 'Pipli']) },
  { name: 'Panchkula', state: 'Haryana', subLocations: locs(['Sector 7', 'Sector 11', 'Mansa Devi Complex', 'Raipur Rani', 'Morni']) },
  { name: 'Jind', state: 'Haryana', subLocations: locs(['Safidon', 'Narwana', 'Uchana', 'Pillukhera', 'Julana']) },

  // ════════════════════════════════════════════════
  //  HIMACHAL PRADESH
  // ════════════════════════════════════════════════
  { name: 'Shimla', state: 'Himachal Pradesh', subLocations: locs(['Mall Road', 'Sanjauli', 'Chhota Shimla', 'New Shimla', 'Rampur Road', 'Vikasnagar', 'Boileauganj', 'Kaithu']) },
  { name: 'Dharamshala', state: 'Himachal Pradesh', subLocations: locs(['McLeod Ganj', 'Kotwali Bazar', 'Sidhpur', 'Ramnagar', 'Dari', 'Forsyth Ganj']) },
  { name: 'Manali', state: 'Himachal Pradesh', subLocations: locs(['Old Manali', 'Aleo', 'Vashisht', 'Kullu', 'Bhuntar', 'Naggar']) },
  { name: 'Solan', state: 'Himachal Pradesh', subLocations: locs(['Kasauli Road', 'Subathu', 'Kandaghat', 'Parwanoo', 'Baddi', 'Nalagarh']) },
  { name: 'Mandi', state: 'Himachal Pradesh', subLocations: locs(['Indira Market', 'Paddal', 'Uhl Bridge', 'Sundernagar', 'Jogindernagar']) },
  { name: 'Hamirpur', state: 'Himachal Pradesh', subLocations: locs(['Nadaun', 'Sujanpur', 'Bhota', 'Barsar', 'Tira Sujanpur']) },
  { name: 'Una', state: 'Himachal Pradesh', subLocations: locs(['Haroli', 'Bangana', 'Gagret', 'Amb', 'Daulatpur Chowk']) },
  { name: 'Kullu', state: 'Himachal Pradesh', subLocations: locs(['Dhalpur', 'Mohal', 'Akhara Bazar', 'Bhuntar', 'Naggar']) },
  { name: 'Nahan', state: 'Himachal Pradesh', subLocations: locs(['Paonta Sahib', 'Poanta Sahib Road', 'Renuka', 'Rajgarh', 'Pachhad']) },

  // ════════════════════════════════════════════════
  //  JHARKHAND
  // ════════════════════════════════════════════════
  { name: 'Ranchi', state: 'Jharkhand', subLocations: locs(['Doranda', 'Lalpur', 'Ashok Nagar', 'Kanke Road', 'Harmu Road', 'Ratu Road', 'Kokar', 'Hinoo']) },
  { name: 'Jamshedpur', state: 'Jharkhand', subLocations: locs(['Bistupur', 'Sakchi', 'Telco', 'Adityapur', 'Kadma', 'Mango', 'Jugsalai', 'Sonari']) },
  { name: 'Dhanbad', state: 'Jharkhand', subLocations: locs(['Bank More', 'Hirapur', 'Jharia', 'Sindri', 'Mugma', 'Govindpur', 'Katras']) },
  { name: 'Bokaro', state: 'Jharkhand', subLocations: locs(['Sector 4', 'Sector 6', 'Chas', 'Chandrapura', 'Ramgarh', 'Gomia']) },
  { name: 'Hazaribagh', state: 'Jharkhand', subLocations: locs(['AG Colony', 'Town Area', 'Barkagaon', 'Chouparan', 'Ichak']) },
  { name: 'Giridih', state: 'Jharkhand', subLocations: locs(['Main Road', 'Deori', 'Tisri', 'Bagodar', 'Bengabad']) },
  { name: 'Deoghar', state: 'Jharkhand', subLocations: locs(['Baidyanath Dham', 'Mohanpur', 'Sarwan', 'Madhupur', 'Jasidih']) },
  { name: 'Dumka', state: 'Jharkhand', subLocations: locs(['Main Market', 'Masalia', 'Jama', 'Ramgarh', 'Shikaripara']) },
  { name: 'Chaibasa', state: 'Jharkhand', subLocations: locs(['Main Road', 'Chakradharpur', 'Khunti', 'Tonto', 'Jagannathpur']) },

  // ════════════════════════════════════════════════
  //  KARNATAKA
  // ════════════════════════════════════════════════
  { name: 'Bengaluru', state: 'Karnataka', subLocations: locs(['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'HSR Layout', 'Jayanagar', 'JP Nagar', 'Marathahalli', 'BTM Layout', 'Yelahanka', 'Hebbal', 'Rajajinagar', 'Malleshwaram']) },
  { name: 'Mysuru', state: 'Karnataka', subLocations: locs(['Vijayanagar', 'Jayalakshmipuram', 'Kuvempunagar', 'Dattagalli', 'Hebbal', 'Nazarbad', 'Chamundi Hill Road']) },
  { name: 'Mangaluru', state: 'Karnataka', subLocations: locs(['Hampankatta', 'Kankanady', 'Pumpwell', 'Kulur', 'Attavar', 'Falnir', 'Kadri', 'Balmatta']) },
  { name: 'Belagavi', state: 'Karnataka', subLocations: locs(['Tilakwadi', 'Camp', 'Vadgaon', 'Hindwadi', 'Shivaji Nagar', 'Sainik Nagar']) },
  { name: 'Hubballi', state: 'Karnataka', subLocations: locs(['Vidyanagar', 'Deshpande Nagar', 'Navanagar', 'Gokul Road', 'Dharwad', 'Unkal']) },
  { name: 'Kalaburagi', state: 'Karnataka', subLocations: locs(['Aland Road', 'Super Market', 'Sedam Road', 'Brundavan Nagar', 'Kalagi']) },
  { name: 'Davanagere', state: 'Karnataka', subLocations: locs(['P.J. Extension', 'MCC B Block', 'Nittuvalli', 'Avaragere', 'Harihara']) },
  { name: 'Ballari', state: 'Karnataka', subLocations: locs(['Cantonment', 'Gandhi Nagar', 'Old Town', 'MSPL Colony', 'Hospet']) },
  { name: 'Shivamogga', state: 'Karnataka', subLocations: locs(['Balaraj Urs Road', 'KM Road', 'Sagara', 'Bhadravathi', 'Shikaripur']) },
  { name: 'Tumakuru', state: 'Karnataka', subLocations: locs(['Gubbi', 'Tiptur', 'Madhugiri', 'Kunigal', 'Pavagada']) },
  { name: 'Vijayapura', state: 'Karnataka', subLocations: locs(['Station Road', 'Gandhi Nagar', 'Sindagi', 'Indi', 'Muddebihal']) },
  { name: 'Hassan', state: 'Karnataka', subLocations: locs(['Belur', 'Halebid', 'Sakleshpur', 'Holenarasipur', 'Arsikere']) },
  { name: 'Udupi', state: 'Karnataka', subLocations: locs(['Manipal', 'Brahmavar', 'Karkala', 'Kundapura', 'Kaup']) },
  { name: 'Bidar', state: 'Karnataka', subLocations: locs(['Fort Road', 'Udgir', 'Basavakalyan', 'Bhalki', 'Humnabad']) },
  { name: 'Raichur', state: 'Karnataka', subLocations: locs(['Station Road', 'Lingsugur', 'Manvi', 'Devadurga', 'Sindhanur']) },
  { name: 'Chikkamagaluru', state: 'Karnataka', subLocations: locs(['Gandhi Square', 'Kadur', 'Tarikere', 'Mudigere', 'Koppa']) },
  { name: 'Madikeri', state: 'Karnataka', subLocations: locs(['Raja Seat', 'Virajpet', 'Gonikoppal', 'Kushalnagar', 'Suntikoppa']) },

  // ════════════════════════════════════════════════
  //  KERALA
  // ════════════════════════════════════════════════
  { name: 'Thiruvananthapuram', state: 'Kerala', subLocations: locs(['Pattom', 'Kowdiar', 'Kesavadasapuram', 'Kazhakuttam', 'Vellayambalam', 'Thampanoor', 'Palayam', 'Medical College', 'Sreekaryam']) },
  { name: 'Kochi', state: 'Kerala', subLocations: locs(['Edapally', 'Kakkanad', 'Palarivattom', 'Aluva', 'Tripunithura', 'Fort Kochi', 'Vyttila', 'Kaloor', 'Kalamassery', 'Thrikkakara']) },
  { name: 'Kozhikode', state: 'Kerala', subLocations: locs(['Calicut Beach', 'Mavoor Road', 'Palayam', 'Nadakkavu', 'East Hill', 'Feroke', 'Beypore', 'Vatakara']) },
  { name: 'Thrissur', state: 'Kerala', subLocations: locs(['Punkunnam', 'Ollur', 'Ayyanthole', 'Poothole', 'Thrissur Round', 'Guruvayur', 'Kodungallur']) },
  { name: 'Kannur', state: 'Kerala', subLocations: locs(['Thavakkara', 'Kannur Beach', 'Payyambalam', 'Iritty', 'Thalassery', 'Payyannur']) },
  { name: 'Kollam', state: 'Kerala', subLocations: locs(['Chinnakada', 'Kavanad', 'Kadappakada', 'Asramam', 'Kottiyam', 'Punalur']) },
  { name: 'Palakkad', state: 'Kerala', subLocations: locs(['Town Hall Road', 'Coimbatore Road', 'Kalmandapam', 'Shoranur', 'Ottapalam']) },
  { name: 'Alappuzha', state: 'Kerala', subLocations: locs(['Mullakkal', 'KSRTC Stand Road', 'Haripad', 'Chengannur', 'Kayamkulam']) },
  { name: 'Kottayam', state: 'Kerala', subLocations: locs(['KK Road', 'Nagampadam', 'Changanacherry', 'Pala', 'Ettumanoor']) },
  { name: 'Malappuram', state: 'Kerala', subLocations: locs(['Manjeri', 'Perinthalmanna', 'Tirur', 'Ponnani', 'Tirurrangadi']) },
  { name: 'Kasaragod', state: 'Kerala', subLocations: locs(['Kanhangad', 'Uppala', 'Bekal', 'Manjeshwar', 'Hosdurg']) },
  { name: 'Pathanamthitta', state: 'Kerala', subLocations: locs(['Adoor', 'Thiruvalla', 'Pandalam', 'Kozhencherry', 'Ranni']) },

  // ════════════════════════════════════════════════
  //  MADHYA PRADESH
  // ════════════════════════════════════════════════
  { name: 'Bhopal', state: 'Madhya Pradesh', subLocations: locs(['MP Nagar', 'Arera Colony', 'Kolar Road', 'Bairagarh', 'Habibganj', 'Shahpura', 'Berasia Road', 'New Market', 'Shyamla Hills']) },
  { name: 'Indore', state: 'Madhya Pradesh', subLocations: locs(['Vijay Nagar', 'Palasia', 'AB Road', 'Bhawarkuan', 'Sapna Sangeeta', 'MR 10', 'Scheme 54', 'Rau', 'Super Corridor']) },
  { name: 'Jabalpur', state: 'Madhya Pradesh', subLocations: locs(['Napier Town', 'Civil Lines', 'Gorakhpur', 'Adhartal', 'Wright Town', 'Madan Mahal', 'Vijay Nagar']) },
  { name: 'Gwalior', state: 'Madhya Pradesh', subLocations: locs(['Morar', 'City Centre', 'Lashkar', 'Thatipur', 'Padav', 'Kampoo', 'Maharaj Bada']) },
  { name: 'Ujjain', state: 'Madhya Pradesh', subLocations: locs(['Freeganj', 'Mahakal Area', 'Nanakheda', 'Dewas Road', 'Maksi Road', 'Madhav Nagar']) },
  { name: 'Sagar', state: 'Madhya Pradesh', subLocations: locs(['Makronia', 'Civil Lines', 'Tili', 'Khurai', 'Banda']) },
  { name: 'Satna', state: 'Madhya Pradesh', subLocations: locs(['Rewa Road', 'Civil Lines', 'Birsinghpur', 'Maihar', 'Chitrakoot']) },
  { name: 'Dewas', state: 'Madhya Pradesh', subLocations: locs(['City Area', 'Industrial Area', 'Tonk Khurd', 'Kannod', 'Bagli']) },
  { name: 'Ratlam', state: 'Madhya Pradesh', subLocations: locs(['Javad Road', 'Sailana', 'Jaora', 'Alot', 'Piploda']) },
  { name: 'Rewa', state: 'Madhya Pradesh', subLocations: locs(['Civil Lines', 'Urahra', 'Mauganj', 'Sirmour', 'Teonthar']) },
  { name: 'Singrauli', state: 'Madhya Pradesh', subLocations: locs(['Waidhan', 'Morwa', 'Chitrangi', 'Devsar', 'Amlori']) },
  { name: 'Chhindwara', state: 'Madhya Pradesh', subLocations: locs(['Parasia', 'Amarwara', 'Saunsar', 'Tamia', 'Pandurna']) },
  { name: 'Guna', state: 'Madhya Pradesh', subLocations: locs(['Moti Nagar', 'New Colony', 'Raghogarh', 'Chachoda', 'Maksudangarh']) },
  { name: 'Shivpuri', state: 'Madhya Pradesh', subLocations: locs(['Madhav Nagar', 'Kolaras', 'Pichhore', 'Pohari', 'Narwar']) },
  { name: 'Morena', state: 'Madhya Pradesh', subLocations: locs(['Ambah', 'Porsa', 'Kailaras', 'Joura', 'Sabalgadh']) },
  { name: 'Bhind', state: 'Madhya Pradesh', subLocations: locs(['Mehgaon', 'Lahar', 'Ater', 'Gohad', 'Mihona']) },

  // ════════════════════════════════════════════════
  //  MAHARASHTRA
  // ════════════════════════════════════════════════
  { name: 'Mumbai', state: 'Maharashtra', subLocations: locs(['Andheri', 'Bandra', 'Juhu', 'Dadar', 'Lower Parel', 'Borivali', 'Malad', 'Thane', 'Navi Mumbai', 'Kurla', 'Powai', 'Worli', 'Goregaon', 'Mulund']) },
  { name: 'Pune', state: 'Maharashtra', subLocations: locs(['Koregaon Park', 'Baner', 'Hinjewadi', 'Wakad', 'Kharadi', 'Hadapsar', 'Viman Nagar', 'Aundh', 'Kothrud', 'Katraj', 'Magarpatta', 'Shivajinagar']) },
  { name: 'Nagpur', state: 'Maharashtra', subLocations: locs(['Dharampeth', 'Ramdaspeth', 'Sitabuldi', 'Sadar', 'Manewada', 'Hingna Road', 'Wardha Road', 'Trimurti Nagar', 'Civil Lines']) },
  { name: 'Nashik', state: 'Maharashtra', subLocations: locs(['College Road', 'Gangapur Road', 'Panchvati', 'Cidco', 'Satpur', 'Indira Nagar', 'Deolali', 'Malegaon']) },
  { name: 'Aurangabad', state: 'Maharashtra', subLocations: locs(['Cidco', 'Waluj', 'Garkheda', 'Cantonment', 'Osmanpura', 'Nirala Bazar', 'Jalna Road']) },
  { name: 'Thane', state: 'Maharashtra', subLocations: locs(['Ghodbunder Road', 'Majiwada', 'Hiranandani Estate', 'Vartak Nagar', 'Kopri', 'Wagle Estate']) },
  { name: 'Solapur', state: 'Maharashtra', subLocations: locs(['Hotgi Road', 'Akkalkot Road', 'Bijapur Road', 'Vijaypur Road', 'Kumtha Naka', 'Pandharpur']) },
  { name: 'Amravati', state: 'Maharashtra', subLocations: locs(['Rajapeth', 'Jaistambh Chowk', 'Gadge Nagar', 'Badnera', 'Anjangaon']) },
  { name: 'Kolhapur', state: 'Maharashtra', subLocations: locs(['Tarabai Park', 'Shivaji Park', 'Kalamba', 'Kasba Bawda', 'Rajaram Road']) },
  { name: 'Akola', state: 'Maharashtra', subLocations: locs(['Civil Lines', 'Ramdaspeth', 'Gandhi Nagar', 'Murtizapur', 'Akot']) },
  { name: 'Latur', state: 'Maharashtra', subLocations: locs(['Ausa Road', 'New Mondha', 'Udgir', 'Nilanga', 'Ausa']) },
  { name: 'Nanded', state: 'Maharashtra', subLocations: locs(['Shivaji Nagar', 'Guru Nanak Nagar', 'Vazirabad', 'Degloor', 'Kinwat']) },
  { name: 'Jalgaon', state: 'Maharashtra', subLocations: locs(['Gandhi Nagar', 'Nehru Nagar', 'Bhusawal', 'Pachora', 'Chalisgaon']) },
  { name: 'Ahmednagar', state: 'Maharashtra', subLocations: locs(['Savedi', 'Maliwada', 'Newasa', 'Kopargaon', 'Sangamner']) },
  { name: 'Chandrapur', state: 'Maharashtra', subLocations: locs(['Civil Lines', 'Ballarpur', 'Rajura', 'Mul', 'Bhadravati']) },
  { name: 'Yavatmal', state: 'Maharashtra', subLocations: locs(['Wani Road', 'Darwha', 'Digras', 'Ner', 'Pusad']) },
  { name: 'Ratnagiri', state: 'Maharashtra', subLocations: locs(['Mirkarwada', 'Chiplun', 'Khed', 'Guhagar', 'Dapoli']) },
  { name: 'Satara', state: 'Maharashtra', subLocations: locs(['Koregaon', 'Wai', 'Karad', 'Panchgani', 'Mahabaleshwar']) },
  { name: 'Sangli', state: 'Maharashtra', subLocations: locs(['Miraj', 'Kupwad', 'Islampur', 'Shirala', 'Kavthemahankal']) },
  { name: 'Dhule', state: 'Maharashtra', subLocations: locs(['Station Road', 'Shivaji Nagar', 'Nardana', 'Shirpur', 'Sakri']) },
  { name: 'Nandurbar', state: 'Maharashtra', subLocations: locs(['Shahada', 'Navapur', 'Taloda', 'Akkalkuwa', 'Dhadgaon']) },
  { name: 'Wardha', state: 'Maharashtra', subLocations: locs(['Sewagram', 'Pulgaon', 'Arvi', 'Deoli', 'Hinganghat']) },

  // ════════════════════════════════════════════════
  //  MANIPUR
  // ════════════════════════════════════════════════
  { name: 'Imphal', state: 'Manipur', subLocations: locs(['Paona Bazar', 'Thangal Bazar', 'BT Road', 'Lamphelpat', 'Singjamei', 'Keishampat', 'Majorkhul']) },
  { name: 'Churachandpur', state: 'Manipur', subLocations: locs(['Tuibong', 'Henglep', 'Singngat', 'Thanlon', 'Tipaimukh']) },
  { name: 'Thoubal', state: 'Manipur', subLocations: locs(['Wangjing', 'Kakching', 'Heirok', 'Lilong', 'Yairipok']) },
  { name: 'Bishnupur', state: 'Manipur', subLocations: locs(['Moirang', 'Nambol', 'Oinam', 'Kumbi', 'Ngaikhong']) },

  // ════════════════════════════════════════════════
  //  MEGHALAYA
  // ════════════════════════════════════════════════
  { name: 'Shillong', state: 'Meghalaya', subLocations: locs(['Police Bazar', 'Laitumkhrah', 'Nongthymmai', 'Rynjah', 'Jail Road', 'Mawlai', 'Malki']) },
  { name: 'Tura', state: 'Meghalaya', subLocations: locs(['Tura Bazar', 'Tura Peak Road', 'Phulbari', 'Dalu', 'Resubelpara']) },
  { name: 'Jowai', state: 'Meghalaya', subLocations: locs(['Main Market', 'Wahiajer', 'Muktapur', 'Nongtalang', 'Khliehriat']) },
  { name: 'Nongpoh', state: 'Meghalaya', subLocations: locs(['Umling', 'Umiam', 'Mawhati', 'Ri Bhoi Area', 'Umsning']) },

  // ════════════════════════════════════════════════
  //  MIZORAM
  // ════════════════════════════════════════════════
  { name: 'Aizawl', state: 'Mizoram', subLocations: locs(['Zarkawt', 'Bawngkawn', 'Chaltlang', 'Durtlang', 'Ramhlun', 'Khatla', 'Zemabawk']) },
  { name: 'Lunglei', state: 'Mizoram', subLocations: locs(['Lunglei Bazar', 'Hrangchalkawn', 'Bunghmun', 'Tlabung', 'Zawlnuam']) },
  { name: 'Champhai', state: 'Mizoram', subLocations: locs(['Champhai Town', 'Zokhawthar', 'Khawzawl', 'Ngopa', 'Vanzau']) },

  // ════════════════════════════════════════════════
  //  NAGALAND
  // ════════════════════════════════════════════════
  { name: 'Kohima', state: 'Nagaland', subLocations: locs(['New Market', 'High School Road', 'Jail Colony', 'Dobashi', 'Purana Bazar', 'Aradura']) },
  { name: 'Dimapur', state: 'Nagaland', subLocations: locs(['Super Market', 'Circular Road', 'Hong Kong Market', 'Duncan Basti', 'Chumukedima', 'Midland']) },
  { name: 'Mokokchung', state: 'Nagaland', subLocations: locs(['Town', 'Merapani', 'Longchem', 'Impur', 'Mangkolemba']) },
  { name: 'Tuensang', state: 'Nagaland', subLocations: locs(['Town Area', 'Noklak', 'Shamator', 'Longkhim', 'Chare']) },

  // ════════════════════════════════════════════════
  //  ODISHA
  // ════════════════════════════════════════════════
  { name: 'Bhubaneswar', state: 'Odisha', subLocations: locs(['Saheed Nagar', 'Patia', 'Chandrasekharpur', 'Nayapalli', 'Jaydev Vihar', 'Khandagiri', 'Bomikhal', 'Master Canteen', 'Old Town']) },
  { name: 'Cuttack', state: 'Odisha', subLocations: locs(['Buxi Bazar', 'Badambadi', 'Mangalabag', 'Govind Nagar', 'Nua Bazar', 'Chauliaganj']) },
  { name: 'Rourkela', state: 'Odisha', subLocations: locs(['Uditnagar', 'Sector 6', 'Chhend', 'Shaktinagar', 'Bondamunda', 'Civil Township', 'Panposh']) },
  { name: 'Berhampur', state: 'Odisha', subLocations: locs(['Bada Bazar', 'Ambapua', 'Station Road', 'Gandhi Nagar', 'Engineering School Road']) },
  { name: 'Sambalpur', state: 'Odisha', subLocations: locs(['Budharaja', 'Khetrajpur', 'Ainthapali', 'Modipara', 'Hirakud']) },
  { name: 'Puri', state: 'Odisha', subLocations: locs(['Grand Road', 'Swargadwar', 'Sea Beach Road', 'Chakratirtha Road', 'CT Road']) },
  { name: 'Balasore', state: 'Odisha', subLocations: locs(['Town Road', 'Remuna', 'Nilgiri', 'Soro', 'Jaleswar']) },
  { name: 'Baripada', state: 'Odisha', subLocations: locs(['Station Road', 'Rairangpur', 'Jashipur', 'Udala', 'Karanjia']) },
  { name: 'Balangir', state: 'Odisha', subLocations: locs(['Town Road', 'Titilagarh', 'Patnagarh', 'Kantabanji', 'Saintala']) },
  { name: 'Koraput', state: 'Odisha', subLocations: locs(['Jeypore', 'Nabarangpur', 'Malkangiri', 'Sunabeda', 'Kotpad']) },
  { name: 'Jharsuguda', state: 'Odisha', subLocations: locs(['Town Area', 'Brajarajnagar', 'Belpahar', 'Bamra', 'Kuchinda']) },
  { name: 'Bhadrak', state: 'Odisha', subLocations: locs(['Dhamara Road', 'Basudevpur', 'Dhamnagar', 'Chandbali', 'Aradi']) },

  // ════════════════════════════════════════════════
  //  PUNJAB
  // ════════════════════════════════════════════════
  { name: 'Ludhiana', state: 'Punjab', subLocations: locs(['Model Town', 'Sarabha Nagar', 'BRS Nagar', 'Dugri', 'Pakhowal Road', 'Ferozepur Road', 'GT Road', 'Haibowal']) },
  { name: 'Amritsar', state: 'Punjab', subLocations: locs(['Golden Temple Area', 'Lawrence Road', 'Ranjit Avenue', 'Green Avenue', 'Majitha Road', 'GT Road', 'Batala Road']) },
  { name: 'Jalandhar', state: 'Punjab', subLocations: locs(['Model Town', 'Guru Nanak Colony', 'Lamba Pind', 'BMC Chowk', 'Phagwara Road', 'GT Road', 'Nakodar Road']) },
  { name: 'Chandigarh', state: 'Punjab', subLocations: locs(['Sector 17', 'Sector 22', 'Sector 35', 'Panchkula', 'Mohali', 'IT Park', 'Sector 43']) },
  { name: 'Patiala', state: 'Punjab', subLocations: locs(['Model Town', 'Urban Estate', 'Leela Bhawan', 'Rajpura', 'Sangrur Road', 'Bahadurgarh']) },
  { name: 'Bathinda', state: 'Punjab', subLocations: locs(['Civil Lines', 'Ablu Road', 'Goniana Road', 'Thermal Colony', 'Talwandi Sabo']) },
  { name: 'Mohali', state: 'Punjab', subLocations: locs(['Phase 7', 'Phase 10', 'Airport Road', 'Kharar', 'Zirakpur', 'Derabassi']) },
  { name: 'Pathankot', state: 'Punjab', subLocations: locs(['Dalhousie Road', 'Mamun Road', 'Sujanpur', 'Chakki Bank', 'Sarna Nangal']) },
  { name: 'Hoshiarpur', state: 'Punjab', subLocations: locs(['Civil Lines', 'Tanda', 'Mukerian', 'Dasuya', 'Garhshankar']) },
  { name: 'Firozpur', state: 'Punjab', subLocations: locs(['Cantonment', 'Civil Lines', 'Guru Harsahai', 'Fazilka', 'Jalalabad']) },
  { name: 'Gurdaspur', state: 'Punjab', subLocations: locs(['Civil Lines', 'Batala', 'Dera Baba Nanak', 'Dhariwal', 'Dinanagar']) },
  { name: 'Moga', state: 'Punjab', subLocations: locs(['GT Road', 'Baghapurana', 'Nihal Singh Wala', 'Dharamkot', 'Kot Ise Khan']) },
  { name: 'Sangrur', state: 'Punjab', subLocations: locs(['Civil Lines', 'Malerkotla', 'Sunam', 'Barnala', 'Dhuri']) },

  // ════════════════════════════════════════════════
  //  RAJASTHAN
  // ════════════════════════════════════════════════
  { name: 'Jaipur', state: 'Rajasthan', subLocations: locs(['Malviya Nagar', 'Vaishali Nagar', 'C Scheme', 'Mansarovar', 'Tonk Road', 'Ajmer Road', 'Jagatpura', 'Pratap Nagar', 'Sanganer', 'Sitapura']) },
  { name: 'Jodhpur', state: 'Rajasthan', subLocations: locs(['Ratanada', 'Sardarpura', 'Shastri Nagar', 'Pal Road', 'Chopasni Housing Board', 'Bhati Circle', 'Paota', 'Salawas Road']) },
  { name: 'Udaipur', state: 'Rajasthan', subLocations: locs(['City Palace Area', 'Hiran Magri', 'Sukhadia Circle', 'Chetak Circle', 'Fatehpura', 'Dabok', 'Shobhagpura']) },
  { name: 'Ajmer', state: 'Rajasthan', subLocations: locs(['Dargah Area', 'Vaishali Nagar', 'Naya Bazar', 'Kutchery Road', 'Makhupura', 'Nasirabad', 'Beawar']) },
  { name: 'Kota', state: 'Rajasthan', subLocations: locs(['Vigyan Nagar', 'Talwandi', 'Mahaveer Nagar', 'Dadabari', 'Rangpur Road', 'Gumanpura', 'Borkhera', 'Jawahar Nagar']) },
  { name: 'Bikaner', state: 'Rajasthan', subLocations: locs(['Rani Bazar', 'Station Road', 'Paota', 'Shiv Bari Road', 'PBM Hospital Road', 'Gandhi Nagar']) },
  { name: 'Alwar', state: 'Rajasthan', subLocations: locs(['Vijay Mandir Road', 'Bypass Road', 'Yatri Niwas', 'Scheme 1', 'Malkhan Singh Nagar', 'Bhiwadi']) },
  { name: 'Bhilwara', state: 'Rajasthan', subLocations: locs(['Textile Nagar', 'Shastri Nagar', 'Sanganer Road', 'Kankroli', 'Gulabpura']) },
  { name: 'Bharatpur', state: 'Rajasthan', subLocations: locs(['Keoladeo Area', 'Civil Lines', 'Kumher', 'Deeg', 'Nagar']) },
  { name: 'Sikar', state: 'Rajasthan', subLocations: locs(['Fatehpur Road', 'Jhunjhunu Road', 'Shyam Colony', 'Neem Ka Thana', 'Laxmangarh']) },
  { name: 'Pali', state: 'Rajasthan', subLocations: locs(['Industrial Area', 'Civil Lines', 'Marwar Junction', 'Sojat', 'Bali']) },
  { name: 'Sri Ganganagar', state: 'Rajasthan', subLocations: locs(['1 LNP', '6 SNP', 'Suratgarh', 'Anupgarh', 'Raisinghnagar']) },
  { name: 'Nagaur', state: 'Rajasthan', subLocations: locs(['Old Town', 'Nawa', 'Makrana', 'Didwana', 'Mundwa']) },
  { name: 'Barmer', state: 'Rajasthan', subLocations: locs(['Station Road', 'Baytu', 'Pachpadra', 'Sheo', 'Gudamalani']) },
  { name: 'Tonk', state: 'Rajasthan', subLocations: locs(['Alaniya Road', 'Rajmahal Road', 'Newai', 'Malpura', 'Uniara']) },
  { name: 'Jaisalmer', state: 'Rajasthan', subLocations: locs(['Fort Area', 'Shiv Road', 'Amar Sagar Pol', 'Sam Road', 'Pokaran']) },
  { name: 'Churu', state: 'Rajasthan', subLocations: locs(['Station Road', 'Sujangarh', 'Ratangarh', 'Sardarshahar', 'Taranagar']) },
  { name: 'Jhunjhunu', state: 'Rajasthan', subLocations: locs(['Old Town', 'Pilani', 'Chirawa', 'Nawalgarh', 'Bissau']) },
  { name: 'Sawai Madhopur', state: 'Rajasthan', subLocations: locs(['Ranthambore Road', 'Gangapur City', 'Wazirpur', 'Bonli', 'Khandar']) },
  { name: 'Dholpur', state: 'Rajasthan', subLocations: locs(['Station Road', 'Bari', 'Rajakhera', 'Baseri', 'Sirmathura']) },

  // ════════════════════════════════════════════════
  //  SIKKIM
  // ════════════════════════════════════════════════
  { name: 'Gangtok', state: 'Sikkim', subLocations: locs(['MG Marg', 'Tadong', 'Ranipool', 'Deorali', 'Lal Bazar', 'Arithang']) },
  { name: 'Namchi', state: 'Sikkim', subLocations: locs(['Jorethang', 'Melli', 'Ravangla', 'Damthang', 'Temi']) },
  { name: 'Mangan', state: 'Sikkim', subLocations: locs(['Lachung', 'Lachen', 'Chungthang', 'Singhik', 'Phensang']) },

  // ════════════════════════════════════════════════
  //  TAMIL NADU
  // ════════════════════════════════════════════════
  { name: 'Chennai', state: 'Tamil Nadu', subLocations: locs(['Anna Nagar', 'T. Nagar', 'Velachery', 'OMR', 'Adyar', 'Mylapore', 'Porur', 'Ambattur', 'Perambur', 'Chromepet', 'Pallavaram', 'Sholinganallur']) },
  { name: 'Coimbatore', state: 'Tamil Nadu', subLocations: locs(['RS Puram', 'Gandhipuram', 'Peelamedu', 'Saibaba Colony', 'Singanallur', 'Ganapathy', 'Race Course', 'Hopes College']) },
  { name: 'Madurai', state: 'Tamil Nadu', subLocations: locs(['Anna Nagar', 'KK Nagar', 'Alwarpet', 'Goripalayam', 'Mattuthavani', 'Usilampatti Road', 'Tallakulam', 'Palanganatham']) },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu', subLocations: locs(['Thillai Nagar', 'KK Nagar', 'Srirangam', 'Woraiyur', 'Ariyamangalam', 'Ponmalai', 'Puthur', 'Kattur']) },
  { name: 'Salem', state: 'Tamil Nadu', subLocations: locs(['Hasthampatti', 'Fairlands', 'Suramangalam', 'Alagapuram', 'Cherry Road', 'Swarnapuri', 'Sooramangalam']) },
  { name: 'Tirunelveli', state: 'Tamil Nadu', subLocations: locs(['Palayamkottai', 'Melapalayam', 'Perumalpuram', 'Vannarpettai', 'Pettai', 'Ambasamudram']) },
  { name: 'Erode', state: 'Tamil Nadu', subLocations: locs(['Perundurai', 'Bhavani', 'Gobichettipalayam', 'Sathyamangalam', 'Kodumudi']) },
  { name: 'Tiruppur', state: 'Tamil Nadu', subLocations: locs(['Town Hall', 'Kangeyam Road', 'Avinashi Road', 'Palladam', 'Dharapuram']) },
  { name: 'Vellore', state: 'Tamil Nadu', subLocations: locs(['Gandhi Nagar', 'CMC Area', 'Katpadi', 'Ranipet', 'Arcot']) },
  { name: 'Thoothukudi', state: 'Tamil Nadu', subLocations: locs(['Port Area', 'Rose Nagar', 'Korampallam', 'Millerpuram', 'Arockiapuram']) },
  { name: 'Dindigul', state: 'Tamil Nadu', subLocations: locs(['Batlagundu', 'Palani', 'Kodaikanal', 'Vedasandur', 'Natham']) },
  { name: 'Thanjavur', state: 'Tamil Nadu', subLocations: locs(['Medical College Road', 'Kumbakonam', 'Papanasam', 'Needamangalam', 'Pattukottai']) },
  { name: 'Kanchipuram', state: 'Tamil Nadu', subLocations: locs(['Pillaiyar Palayam', 'Uthiramerur', 'Sriperumbudur', 'Walajabad', 'Chengalpattu']) },
  { name: 'Nagercoil', state: 'Tamil Nadu', subLocations: locs(['Marthandam', 'Padmanabhapuram', 'Thuckalay', 'Colachel', 'Kanyakumari']) },
  { name: 'Hosur', state: 'Tamil Nadu', subLocations: locs(['SIPCOT', 'Denkanikottai', 'Krishnagiri', 'Veppur', 'Pochampalli']) },
  { name: 'Ooty', state: 'Tamil Nadu', subLocations: locs(['Charing Cross', 'Coonoor', 'Gudalur', 'Kotagiri', 'Udhagamandalam']) },
  { name: 'Karur', state: 'Tamil Nadu', subLocations: locs(['Sanapiratti', 'Kulithalai', 'Thanthonimalai', 'Manmangalam', 'Pugalur']) },
  { name: 'Cuddalore', state: 'Tamil Nadu', subLocations: locs(['Silvergate', 'SIPCOT Cuddalore', 'Chidambaram', 'Panruti', 'Virudhachalam']) },

  // ════════════════════════════════════════════════
  //  TELANGANA
  // ════════════════════════════════════════════════
  { name: 'Hyderabad', state: 'Telangana', subLocations: locs(['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Hitech City', 'Madhapur', 'Kukatpally', 'Secunderabad', 'Ameerpet', 'Dilsukhnagar', 'LB Nagar', 'Mehdipatnam', 'Kondapur']) },
  { name: 'Warangal', state: 'Telangana', subLocations: locs(['Hanamkonda', 'Kazipet', 'Balasamudram', 'Subedari', 'NIT Area', 'Khammam Road']) },
  { name: 'Nizamabad', state: 'Telangana', subLocations: locs(['Fathimanagar', 'Indalwai', 'Armur', 'Kamareddy', 'Bodhan', 'Dichpally']) },
  { name: 'Karimnagar', state: 'Telangana', subLocations: locs(['Ramagundam', 'Jagtial', 'Mancherial', 'Sircilla', 'Peddapalli', 'Sultanabad']) },
  { name: 'Khammam', state: 'Telangana', subLocations: locs(['Wyra Road', 'Kothagudem', 'Palwancha', 'Bhadrachalam', 'Sattupally']) },
  { name: 'Mahbubnagar', state: 'Telangana', subLocations: locs(['Jadcherla', 'Wanaparthy', 'Narayanpet', 'Kollapur', 'Nagarkurnool']) },
  { name: 'Nalgonda', state: 'Telangana', subLocations: locs(['Miryalaguda', 'Suryapet', 'Bhongir', 'Devarakonda', 'Nakrekal']) },
  { name: 'Adilabad', state: 'Telangana', subLocations: locs(['Mancherial', 'Nirmal', 'Bhainsa', 'Boath', 'Asifabad']) },
  { name: 'Sangareddy', state: 'Telangana', subLocations: locs(['Patancheru', 'Zahirabad', 'Sadasivpet', 'Narayankhed', 'Andol']) },
  { name: 'Siddipet', state: 'Telangana', subLocations: locs(['Gajwel', 'Husnabad', 'Dubbak', 'Medak', 'Toopran']) },

  // ════════════════════════════════════════════════
  //  TRIPURA
  // ════════════════════════════════════════════════
  { name: 'Agartala', state: 'Tripura', subLocations: locs(['Battala', 'Ramnagar', 'Krishnanagar', 'Amtali', 'Bordowali', 'Abhoynagar']) },
  { name: 'Udaipur', state: 'Tripura', subLocations: locs(['Sonamura', 'Majlishpur', 'Bishalgarh', 'Sepahijala', 'Melaghar']) },
  { name: 'Dharmanagar', state: 'Tripura', subLocations: locs(['North Tripura', 'Panisagar', 'Kanchanpur', 'Kumarghat', 'Machmara']) },
  { name: 'Belonia', state: 'Tripura', subLocations: locs(['Sabroom', 'Matarbari', 'Santirbazar', 'Hrishyamukh', 'Rajnagar']) },

  // ════════════════════════════════════════════════
  //  UTTAR PRADESH
  // ════════════════════════════════════════════════
  { name: 'Lucknow', state: 'Uttar Pradesh', subLocations: locs(['Hazratganj', 'Gomti Nagar', 'Aliganj', 'Indiranagar', 'Vikas Nagar', 'Alambagh', 'Chowk', 'Mahanagar', 'Rajajipuram', 'Jankipuram']) },
  { name: 'Kanpur', state: 'Uttar Pradesh', subLocations: locs(['Civil Lines', 'Swaroop Nagar', 'Kalyanpur', 'Kidwai Nagar', 'Armapur', 'Arya Nagar', 'Govind Nagar', 'Kakadeo', 'Shyam Nagar']) },
  { name: 'Agra', state: 'Uttar Pradesh', subLocations: locs(['Taj Ganj', 'Civil Lines', 'Kamla Nagar', 'Sanjay Place', 'Bodla', 'Sikandra', 'Shahganj', 'Balkeshwar']) },
  { name: 'Varanasi', state: 'Uttar Pradesh', subLocations: locs(['Godowlia', 'Lanka', 'Sigra', 'Sarnath', 'Bhelupur', 'Cantonment', 'Rathyatra', 'Assi Ghat', 'Shivpur']) },
  { name: 'Prayagraj', state: 'Uttar Pradesh', subLocations: locs(['Civil Lines', 'Allapur', 'George Town', 'Naini', 'Jhunsi', 'Phaphamau', 'Karchana', 'Mumfordganj']) },
  { name: 'Meerut', state: 'Uttar Pradesh', subLocations: locs(['Shastri Nagar', 'Civil Lines', 'Cantonment', 'Pallavpuram', 'Hapur Road', 'Delhi Road', 'Garh Road', 'Mangal Pandey Nagar']) },
  { name: 'Noida', state: 'Uttar Pradesh', subLocations: locs(['Sector 18', 'Sector 62', 'Sector 137', 'Greater Noida', 'Sector 76', 'Film City', 'Sector 50', 'Sector 125']) },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', subLocations: locs(['Indirapuram', 'Vaishali', 'Kaushambi', 'Raj Nagar', 'Crossing Republik', 'Mohan Nagar', 'Siddharth Vihar']) },
  { name: 'Bareilly', state: 'Uttar Pradesh', subLocations: locs(['Civil Lines', 'Subhash Nagar', 'CB Ganj', 'Izzatnagar', 'Rajendra Nagar', 'Pilibhit Bypass']) },
  { name: 'Moradabad', state: 'Uttar Pradesh', subLocations: locs(['Civil Lines', 'Buddhi Vihar', 'Ram Ganga Vihar', 'Rampur Road', 'Delhi Road', 'Pakwara']) },
  { name: 'Aligarh', state: 'Uttar Pradesh', subLocations: locs(['Civil Lines', 'AMU Campus', 'Ramghat Road', 'Marris Road', 'Dhanipur', 'Quarsi']) },
  { name: 'Gorakhpur', state: 'Uttar Pradesh', subLocations: locs(['Golghar', 'Belhaghat', 'Taramandal', 'Medical College Road', 'Rustampur', 'Basharatpur']) },
  { name: 'Mathura', state: 'Uttar Pradesh', subLocations: locs(['Govardhan', 'Vrindavan', 'New Market', 'Civil Lines', 'Holi Gate']) },
  { name: 'Jhansi', state: 'Uttar Pradesh', subLocations: locs(['Sipri Bazar', 'Civil Lines', 'Sadar Bazar', 'Nai Basti', 'Gwalior Road']) },
  { name: 'Ayodhya', state: 'Uttar Pradesh', subLocations: locs(['Ram Janmabhoomi', 'Hanuman Garhi', 'Faizabad', 'Sugreev Kila', 'Saket']) },
  { name: 'Muzaffarnagar', state: 'Uttar Pradesh', subLocations: locs(['Shahpur', 'Budhana', 'Khatauli', 'Shamli', 'Kairana']) },
  { name: 'Saharanpur', state: 'Uttar Pradesh', subLocations: locs(['Court Road', 'Manglaur Road', 'Deoband', 'Gangoh', 'Roorkee Road']) },
  { name: 'Firozabad', state: 'Uttar Pradesh', subLocations: locs(['Glass Industry Area', 'Civil Lines', 'Nai Mandi', 'Shikohabad', 'Tundla']) },
  { name: 'Rampur', state: 'Uttar Pradesh', subLocations: locs(['Azim Nagar', 'Civil Lines', 'Milak', 'Shahabad', 'Suar']) },
  { name: 'Lakhimpur Kheri', state: 'Uttar Pradesh', subLocations: locs(['Civil Lines', 'Gola Gokarnath', 'Mohammadi', 'Palia Kalan', 'Nighasan']) },

  // ════════════════════════════════════════════════
  //  UTTARAKHAND
  // ════════════════════════════════════════════════
  { name: 'Dehradun', state: 'Uttarakhand', subLocations: locs(['Rajpur Road', 'Clement Town', 'ISBT Area', 'Race Course', 'Patel Nagar', 'Sahastradhara Road', 'Raipur Road', 'Vasant Vihar']) },
  { name: 'Haridwar', state: 'Uttarakhand', subLocations: locs(['Jwalapur', 'Kankhal', 'Shivalik Nagar', 'Roshnabad', 'Bhimgoda', 'Ranipur']) },
  { name: 'Rishikesh', state: 'Uttarakhand', subLocations: locs(['Laxman Jhula', 'Ram Jhula', 'Muni Ki Reti', 'Tapovan', 'Swarg Ashram', 'Jonk']) },
  { name: 'Roorkee', state: 'Uttarakhand', subLocations: locs(['IIT Campus', 'Civil Lines', 'Ganj', 'Manglaur', 'Hardwar Road']) },
  { name: 'Haldwani', state: 'Uttarakhand', subLocations: locs(['Nainital Road', 'Kathgodam', 'Banbhoolpura', 'Gaujajali', 'Bareilly Road']) },
  { name: 'Rudrapur', state: 'Uttarakhand', subLocations: locs(['IIE Sitarganj Road', 'Transport Nagar', 'Pantnagar', 'Kichha', 'Bazpur']) },
  { name: 'Nainital', state: 'Uttarakhand', subLocations: locs(['Mall Road', 'Mallital', 'Tallital', 'Sukhatal', 'Bhimtal']) },
  { name: 'Mussoorie', state: 'Uttarakhand', subLocations: locs(['Mall Road', 'Landour', 'Camel Back Road', 'Kempty Falls Area', 'Picture Palace']) },

  // ════════════════════════════════════════════════
  //  WEST BENGAL
  // ════════════════════════════════════════════════
  { name: 'Kolkata', state: 'West Bengal', subLocations: locs(['Salt Lake', 'Park Street', 'New Town', 'Howrah', 'Dum Dum', 'Ballygunge', 'Jadavpur', 'Gariahat', 'Rajarhat', 'Behala', 'Tollygunge', 'Barrackpore']) },
  { name: 'Durgapur', state: 'West Bengal', subLocations: locs(['City Centre', 'Benachity', 'Bidhannagar', 'Nachan Road', 'Rajbandh', 'Andal']) },
  { name: 'Siliguri', state: 'West Bengal', subLocations: locs(['Sevoke Road', 'Hill Cart Road', 'Pradhan Nagar', 'Matigara', 'Bagdogra', 'Dabgram']) },
  { name: 'Asansol', state: 'West Bengal', subLocations: locs(['Burnpur', 'Raniganj', 'Kulti', 'Barakar', 'Jamuria', 'Ukhra']) },
  { name: 'Howrah', state: 'West Bengal', subLocations: locs(['Salkia', 'Liluah', 'Bally', 'Domjur', 'Uluberia', 'Shibpur']) },
  { name: 'Kharagpur', state: 'West Bengal', subLocations: locs(['IIT Area', 'Inda', 'Girimaidan', 'Midnapore', 'Debra']) },
  { name: 'Bardhaman', state: 'West Bengal', subLocations: locs(['GTC More', 'Kalna Road', 'Katwa', 'Durgapur Road', 'Memari']) },
  { name: 'Malda', state: 'West Bengal', subLocations: locs(['English Bazar', 'Old Malda', 'Chanchal', 'Harishchandrapur', 'Gazole']) },
  { name: 'Jalpaiguri', state: 'West Bengal', subLocations: locs(['Kotwali', 'Dhupguri', 'Mal', 'Rajganj', 'Malbazar']) },
  { name: 'Cooch Behar', state: 'West Bengal', subLocations: locs(['Dinhata', 'Mathabhanga', 'Tufanganj', 'Mekhliganj', 'Sitai']) },
  { name: 'Krishnanagar', state: 'West Bengal', subLocations: locs(['Kalyani', 'Ranaghat', 'Nabadwip', 'Chakdaha', 'Shantipur']) },
  { name: 'Purulia', state: 'West Bengal', subLocations: locs(['Jhalda', 'Raghunathpur', 'Manbazar', 'Anara', 'Balarampur']) },
  { name: 'Barasat', state: 'West Bengal', subLocations: locs(['Madhyamgram', 'Habra', 'Gaighata', 'Amdanga', 'Deganga']) },

  // ════════════════════════════════════════════════
  //  DELHI (NCT)
  // ════════════════════════════════════════════════
  { name: 'Delhi', state: 'Delhi', subLocations: locs(['Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Saket', 'Rohini', 'Dwarka', 'Janakpuri', 'Pitampura', 'Preet Vihar', 'Mayur Vihar', 'Noida Extension', 'Shahdara', 'Vasundhara Enclave']) },
  { name: 'New Delhi', state: 'Delhi', subLocations: locs(['India Gate', 'Khan Market', 'South Extension', 'Nehru Place', 'Vasant Kunj', 'Hauz Khas', 'Sarojini Nagar', 'Malviya Nagar', 'Defence Colony']) },

  // ════════════════════════════════════════════════
  //  JAMMU & KASHMIR
  // ════════════════════════════════════════════════
  { name: 'Srinagar', state: 'Jammu & Kashmir', subLocations: locs(['Lal Chowk', 'Rajbagh', 'Jawahar Nagar', 'Dalgate', 'Bemina', 'Soura', 'Hyderpora', 'Nowpora']) },
  { name: 'Jammu', state: 'Jammu & Kashmir', subLocations: locs(['Gandhi Nagar', 'Trikuta Nagar', 'Bakshi Nagar', 'Talab Tillo', 'Channi Himmat', 'Nagrota', 'Bikram Chowk']) },
  { name: 'Anantnag', state: 'Jammu & Kashmir', subLocations: locs(['Bijbehara', 'Kokernag', 'Pahalgam', 'Shangus', 'Larnoo']) },
  { name: 'Baramulla', state: 'Jammu & Kashmir', subLocations: locs(['Sopore', 'Pattan', 'Gulmarg', 'Tangmarg', 'Uri']) },
  { name: 'Kathua', state: 'Jammu & Kashmir', subLocations: locs(['Hiranagar', 'Basholi', 'Billawar', 'Bani', 'Dinga Amb']) },
  { name: 'Udhampur', state: 'Jammu & Kashmir', subLocations: locs(['Ramnagar', 'Chenani', 'Patnitop', 'Krimchi', 'Mansar']) },

  // ════════════════════════════════════════════════
  //  LADAKH
  // ════════════════════════════════════════════════
  { name: 'Leh', state: 'Ladakh', subLocations: locs(['Main Market', 'Changspa', 'Shyam Nagar', 'Phyang', 'Nubra', 'Khardung']) },
  { name: 'Kargil', state: 'Ladakh', subLocations: locs(['Main Bazar', 'Drass', 'Sankoo', 'Padum', 'Zanskar']) },

  // ════════════════════════════════════════════════
  //  PUDUCHERRY
  // ════════════════════════════════════════════════
  { name: 'Puducherry', state: 'Puducherry', subLocations: locs(['White Town', 'Oulgaret', 'Reddiyarpalayam', 'Mudaliarpet', 'Villianur', 'Lawspet']) },
  { name: 'Karaikal', state: 'Puducherry', subLocations: locs(['Thavalakuppam', 'Neravy', 'Kottucherry', 'Tirumalairayanpattinam', 'Nedungadu']) },

  // ════════════════════════════════════════════════
  //  ANDAMAN & NICOBAR ISLANDS
  // ════════════════════════════════════════════════
  { name: 'Port Blair', state: 'Andaman & Nicobar', subLocations: locs(['Aberdeen Bazar', 'Prothrapur', 'Goalghar', 'Haddo', 'Dollygunj', 'Junglighat']) },

  // ════════════════════════════════════════════════
  //  CHANDIGARH (UT)
  // ════════════════════════════════════════════════
  { name: 'Chandigarh', state: 'Chandigarh', subLocations: locs(['Sector 17', 'Sector 22', 'Sector 35', 'Sector 43', 'Manimajra', 'Industrial Area', 'Sector 9']) },

  // ════════════════════════════════════════════════
  //  DADRA & NAGAR HAVELI AND DAMAN & DIU
  // ════════════════════════════════════════════════
  { name: 'Silvassa', state: 'Dadra & Nagar Haveli', subLocations: locs(['Naroli', 'Sayli', 'Amli', 'Khanvel', 'Dudhani']) },
  { name: 'Daman', state: 'Daman & Diu', subLocations: locs(['Nani Daman', 'Moti Daman', 'Devka', 'Seaface Road', 'Bhimpore']) },
  { name: 'Diu', state: 'Daman & Diu', subLocations: locs(['Diu Town', 'Vanakbara', 'Fudam', 'Nagoa', 'Ghoghla']) },

  // ════════════════════════════════════════════════
  //  LAKSHADWEEP
  // ════════════════════════════════════════════════
  { name: 'Kavaratti', state: 'Lakshadweep', subLocations: locs(['Agatti', 'Andrott', 'Kalpeni', 'Minicoy', 'Bangaram']) },
];

module.exports = INDIA_LOCATIONS;

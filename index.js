var express = require('express');
var cors = require('cors');
require('dotenv').config();
// 1. Importer le module multer qu'on vient d'installer
const multer = require('multer');

var app = express();

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});
app.use('/public', express.static(process.cwd() + '/public'));

// 2. Configurer le stockage en mémoire vive (évite d'encombrer le disque dur)
const upload = multer({ storage: multer.memoryStorage() });

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// 3. Créer la route POST attendue par le formulaire de FreeCodeCamp
// 'upfile' correspond à l'attribut name du champ d'envoi de fichier dans l'index.html
app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
  // Vérifier si un fichier a bien été transmis dans la requête
  if (!req.file) {
    return res.json({ error: "Aucun fichier n'a été téléversé." });
  }

  // Extraire les métadonnées requises
  const fileName = req.file.originalname;
  const fileType = req.file.mimetype;
  const fileSize = req.file.size;

  // Renvoyer l'objet JSON au format strict demandé par FreeCodeCamp
  res.json({
    name: fileName,
    type: fileType,
    size: fileSize
  });
});

// Configuration du serveur existante
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
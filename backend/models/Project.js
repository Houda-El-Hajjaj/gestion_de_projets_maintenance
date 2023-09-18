const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  intituleduprojet: {
    type: String,
    unique: true,
  },
  descriptif: String,
  prestataire: String,
  dateodcbp: Date,
  datefinalprevis: Date,
  bordprix: [
    {
      num: Number,
      designation: String,
      U: String,
      quantity: Number,
      pu: Number,
      pt: Number
    }
  ],
  ordrearret: [
    {
      num: Number,
      datearret: Date,
      cause: String,
      datereprise: Date,
      commentaire: String
    }
  ],
  createur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'utilisateurs' // The name of the UserModel collection
  }
}, { timestamps: true });

const ProjectModel = mongoose.model('projects', ProjectSchema);
module.exports = ProjectModel;
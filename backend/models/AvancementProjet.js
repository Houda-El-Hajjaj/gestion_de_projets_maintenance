const mongoose = require('mongoose');

const AvancementProjectSchema = new mongoose.Schema({
    Projet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'projects' // The name of the UserModel collection
    },
    pourcentageAvancementProjet: String,
    EtatAvancement: [
        {
            num: Number,
            designation: String,
            U: String,
            quantity: Number,
            quantityrealised: Number,
            pourcentagerealised: Number,
            montanttotal: Number,
            montantrealised: Number,
            pourcentagerealisedmontant: Number,
            commentaire: String,
            photoavancement: [{
                url: String,
                commentaire: String,
                dateAdded: { type: Date, default: Date.now } 
            }
            ]
        }
    ],
    PointsBloquants: [
        {
            num: Number,
            pointbloquant: String,
            datenotif: Date,
            datetraitement: Date,
            commentaire: String
        }
    ]
}, { timestamps: true });

const AvancementProjectModel = mongoose.model('AvancementProject', AvancementProjectSchema);

module.exports = AvancementProjectModel;

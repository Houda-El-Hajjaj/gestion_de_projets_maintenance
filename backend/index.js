const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const UserModel = require('./models/User')
const ProjectModel = require('./models/Project')
const AvancementProjectModel = require('./models/AvancementProjet')
const multer = require('multer');

const app = express()
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}))
app.use(cookieParser())

app.use('/uploads', express.static('uploads'))


mongoose.connect('mongodb://127.0.0.1:27017/mDb')

const getUserRoleFromToken = async (token) => {
    try {
      const decoded = jwt.verify(token, "jwt-secret-key");
      const createurEmail = decoded.email; 
  
      // Find the user in the database based on the email
      const user = await UserModel.findOne({ email: createurEmail });
      
      if (!user) {
        throw new Error('User not found');
      }
  
      return user.role; // Return the user's role from the database
    } catch (error) {
      throw new Error('Invalid token');
    }
  };


const varifyUserAdmin = (req, res, next) => {
    const token = req.cookies.token
    if(!token){
        return res.json("Token is missing")
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err){
                return res.json("Error with token")
            }else {
                if(decoded.role === "admin"){
                    next()
                }else{
                    return res.json("not admin")
                }
            }
        })
    }
}

const varifyUserVisitor = (req, res, next) => {
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({ error: 'Token is missing' })
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err){
                return res.json("Error with token")
            }else {
                if(decoded.role === "visitor"){
                    next()
                }else{
                    return res.json("not visitor")
                }
            }
        })
    } 
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); // Adjust the path as needed
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// profile
app.get('/getUserInfo/:userId', (req, res) => {
    const { userId } = req.params;

    UserModel.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        })
        .catch(err => res.status(500).json({ error: 'Internal Server Error' }));
});


//Etat d'Avancement

app.get('/etatavancement/:intituleduprojet', (req, res) => {
    const { intituleduprojet } = req.params;

    ProjectModel.findOne({ intituleduprojet }) 
        .then(project => {
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            
            AvancementProjectModel.findOne({ Projet: project._id })
                .then(avancementProject => {
                    if (!avancementProject) {
                        return res.status(404).json({ error: 'AvancementProject not found' });
                    }

                    const etatAvancement = avancementProject.EtatAvancement; 
                    res.json(etatAvancement);
                })
                .catch(err => res.status(500).json({ error: 'Internal Server Error' }));
        })
        .catch(err => res.status(500).json({ error: 'Internal Server Error' }));
});


app.get('/updateetatavancement/:intituleduprojet/:numetatavancement', (req, res) => {
    const { intituleduprojet, numetatavancement } = req.params;

    ProjectModel.findOne({ intituleduprojet }) 
        .then(project => {
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            const projetId = project._id; 

            AvancementProjectModel.findOne({ Projet: projetId }) 
                .then(avancementProject => {
                    if (!avancementProject) {
                        return res.status(404).json({ error: 'AvancementProject not found' });
                    }

                    const etatAvancementItem = avancementProject.EtatAvancement.find(item => item.num === parseInt(numetatavancement));
                    if (!etatAvancementItem) {
                        return res.status(404).json({ error: 'EtatAvancement item not found' });
                    }

                    console.log(etatAvancementItem); 
                    res.json(etatAvancementItem);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: 'Internal Server Error' });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.put('/updateetatavancement/:intituleduprojet/:numetatavancement', upload.single('image'), async (req, res) => {
    const { intituleduprojet, numetatavancement } = req.params;
    const { quantityrealised, commentaire } = req.body;

    try {
        
        const project = await ProjectModel.findOne({ intituleduprojet });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        
        const avancementProject = await AvancementProjectModel.findOne({ Projet: project._id });
        if (!avancementProject) {
            return res.status(404).json({ error: 'AvancementProject not found' });
        }

        const etatavancementIndex = avancementProject.EtatAvancement.findIndex(item => item.num === parseInt(numetatavancement));
        if (etatavancementIndex === -1) {
            return res.status(404).json({ error: 'EtatAvancement item not found' });
        }



        if (commentaire !== null && commentaire !== 'undefined' && commentaire !== '') {
            avancementProject.EtatAvancement[etatavancementIndex].commentaire = commentaire;
        } else {
            avancementProject.EtatAvancement[etatavancementIndex].commentaire = '';
        }
        console.log(commentaire)

        if (quantityrealised !== undefined && quantityrealised <= avancementProject.EtatAvancement[etatavancementIndex].quantity) {
            avancementProject.EtatAvancement[etatavancementIndex].quantityrealised = quantityrealised;
            const bordprixItem = project.bordprix.find(item => item.num === parseInt(numetatavancement));
            if (bordprixItem) {
                const pourcentagerealised = (quantityrealised / bordprixItem.quantity) * 100;
                const montantrealised = quantityrealised * bordprixItem.pu;
                const pourcentagerealisedmontant = (montantrealised / bordprixItem.pt) * 100;

                avancementProject.EtatAvancement[etatavancementIndex].pourcentagerealised = pourcentagerealised;
                avancementProject.EtatAvancement[etatavancementIndex].montantrealised = montantrealised;
                avancementProject.EtatAvancement[etatavancementIndex].pourcentagerealisedmontant = pourcentagerealisedmontant;
            }
        }

        if (req.file) {
            avancementProject.EtatAvancement[etatavancementIndex].photoavancement.push({
                url: req.file.path,
                commentaire: commentaire !== null && commentaire !== undefined ? commentaire : '',
            });
        }

        await avancementProject.save();

        return res.status(200).json({ message: 'EtatAvancement updated successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.delete('/deleteetatavancement/:intituleduprojet/:numordrearret', async (req, res) => {
    const { intituleduprojet, numordrearret } = req.params;

    try {
        const project = await ProjectModel.findOne({ intituleduprojet });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const avancementProject = await AvancementProjectModel.findOne({ Projet: project._id });
        if (!avancementProject) {
            return res.status(404).json({ error: 'AvancementProject not found' });
        }

        const etatavancementIndex = avancementProject.EtatAvancement.findIndex(item => item.num === parseInt(numordrearret));
        if (etatavancementIndex === -1) {
            return res.status(404).json({ error: 'EtatAvancement item not found' });
        }

        const etatavancementItem = avancementProject.EtatAvancement[etatavancementIndex];
        etatavancementItem.quantityrealised = 0;
        etatavancementItem.pourcentagerealised = 0;
        etatavancementItem.montantrealised = 0;
        etatavancementItem.pourcentagerealisedmontant = 0;
        etatavancementItem.commentaire = '';

        await avancementProject.save();

        return res.status(200).json({ message: 'EtatAvancement fields deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/updatepourcentageavancementprojet/:intituleduprojet', async (req, res) => {
    const { intituleduprojet } = req.params;
    let { pourcentageAvancementProjet } = req.body;

    if (pourcentageAvancementProjet === null || pourcentageAvancementProjet === undefined) {
        pourcentageAvancementProjet = '0%';
    }

    ProjectModel.findOne({ intituleduprojet }) 
        .then(project => {
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            AvancementProjectModel.findOne({ Projet: project._id })
                .then(avancementProject => {
                    if (!avancementProject) {
                        return res.status(404).json({ error: 'AvancementProject not found' });
                    }

                    pourcentageAvancementProjet = parseFloat(pourcentageAvancementProjet).toFixed(2);

                    avancementProject.pourcentageAvancementProjet = `${pourcentageAvancementProjet}%`;

                    avancementProject.save()
                        .then(() => {
                            res.json({ message: 'Pourcentage Avancement Projet updated successfully' });
                        })
                        .catch(err => res.status(500).json({ error: 'Internal Server Error' }));
                })
                .catch(err => res.status(500).json({ error: 'Internal Server Error' }));
        })
        .catch(err => res.status(500).json({ error: 'Internal Server Error' }));
});



//Photos
app.get('/photos/:intituleduprojet/:numetatavancement', (req, res) => {
    const { intituleduprojet, numetatavancement } = req.params;

    ProjectModel.findOne({ intituleduprojet }) 
        .then(project => {
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            const projetId = project._id; 

            AvancementProjectModel.findOne({ Projet: projetId }) 
                .then(avancementProject => {
                    if (!avancementProject) {
                        console.error(`AvancementProject not found for intituleduprojet: ${intituleduprojet}`);
                        return res.status(404).json({ error: 'AvancementProject not found' });
                    }
            
                    const etatavancementItem = avancementProject.EtatAvancement.find(item => item.num === parseInt(numetatavancement));
                    if (!etatavancementItem) {
                        console.error(`EtatAvancement item not found for numavancement: ${numetatavancement}`);
                        return res.status(404).json({ error: 'EtatAvancement item not found' });
                    }

                    const photoavancementArray = etatavancementItem.photoavancement;
                    res.json(photoavancementArray);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: 'Internal Server Error' });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



app.post('/photos/:intituleduprojet/:numetatavancement', upload.single('image'), async (req, res) => {
    const { intituleduprojet, numetatavancement } = req.params;
    let { commentaire } = req.body;

    if (commentaire !== 'null' && commentaire !== 'undefined' && commentaire !== '') {
        commentaire = commentaire;
    } else {
        commentaire = '';
    }
    console.log(commentaire)

    try {
        const project = await ProjectModel.findOne({ intituleduprojet });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const projetId = project._id; 

        const avancementProject = await AvancementProjectModel.findOne({ Projet: projetId }); 
        if (!avancementProject) {
            console.error(`AvancementProject not found for intituleduprojet: ${intituleduprojet}`);
            return res.status(404).json({ error: 'AvancementProject not found' });
        }

        const etatavancementItem = avancementProject.EtatAvancement.find(item => item.num === parseInt(numetatavancement));
        if (!etatavancementItem) {
            console.error(`EtatAvancement item not found for numavancement: ${numetatavancement}`);
            return res.status(404).json({ error: 'EtatAvancement item not found' });
        }

        etatavancementItem.photoavancement.push({
            url: req.file.path,
            commentaire: commentaire,
        });

        await avancementProject.save();
        return res.status(200).json({ message: 'Photo added successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});




const fs = require('fs');
const path = require('path');


app.delete('/photos/:intituleduprojet/:numetatavancement/:index', async (req, res) => {
    const { intituleduprojet, numetatavancement, index } = req.params;

    try {
        const project = await ProjectModel.findOne({ intituleduprojet });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const projetId = project._id;

       
        const avancementProject = await AvancementProjectModel.findOne({ Projet: projetId, "EtatAvancement.num": parseInt(numetatavancement) });

        if (!avancementProject) {
            console.error(`AvancementProject not found for intituleduprojet: ${intituleduprojet} and numavancement: ${numetatavancement}`);
            return res.status(404).json({ error: 'AvancementProject not found' });
        }

        const photoUrlToDelete = avancementProject.EtatAvancement.find(item => item.num === parseInt(numetatavancement)).photoavancement[parseInt(index)].url;

        avancementProject.EtatAvancement.find(item => item.num === parseInt(numetatavancement)).photoavancement.splice(parseInt(index), 1);

        await avancementProject.save();

        const filePathToDelete = path.join(__dirname, '', photoUrlToDelete); // Adjust the path as needed
        fs.unlinkSync(filePathToDelete);

        console.log('Photo and file deleted successfully');
        return res.status(200).json({ message: 'Photo and file deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



//Points Blocants
app.get('/pointsbloquants/:intituleduprojet', (req, res) => {
    const { intituleduprojet } = req.params;

    ProjectModel.findOne({ intituleduprojet })
        .then(project => {
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            AvancementProjectModel.findOne({ Projet: project._id })
                .then(avancementproject => {
                    if (!avancementproject) {
                        return res.status(404).json({ error: 'Avancement project not found' });
                    }

                    const PointsBloquants = avancementproject.PointsBloquants;
                    console.log(PointsBloquants);
                    res.json(PointsBloquants);
                })
                .catch(err => res.status(500).json({ error: 'Internal Server Error' }));
        })
        .catch(err => res.status(500).json({ error: 'Internal Server Error' }));
});

app.post('/createpointsbloquants/:intituleduprojet', async (req, res) => {
    const { intituleduprojet } = req.params;
    const { pointbloquant, datenotif, datetraitement, commentaire } = req.body;

    try {
        const project = await ProjectModel.findOne({ intituleduprojet });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const avancementproject = await AvancementProjectModel.findOne({ Projet: project._id });
        if (!avancementproject) {
            return res.status(404).json({ error: 'Avancement project not found' });
        }

        avancementproject.PointsBloquants.push({
            num: avancementproject.PointsBloquants.length + 1, 
            pointbloquant,
            datenotif,
            datetraitement,
            commentaire
        });

        await avancementproject.save();

        return res.status(200).json({ message: 'PointsBloquants added successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/updatepointsbloquants/:intituleduprojet/:numpointblocant', (req, res) => {
    const { intituleduprojet, numpointblocant } = req.params;

    ProjectModel.findOne({ intituleduprojet }) 
        .then(project => {
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            const projetId = project._id; 

            AvancementProjectModel.findOne({ Projet: projetId }) 
                .then(avancementProject => {
                    if (!avancementProject) {
                        return res.status(404).json({ error: 'AvancementProject not found' });
                    }

                    const pointblocantItem = avancementProject.PointsBloquants.find(item => item.num === parseInt(numpointblocant));
                    if (!pointblocantItem) {
                        return res.status(404).json({ error: 'point blocant item not found' });
                    }

                    console.log(pointblocantItem); 
                    res.json(pointblocantItem);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: 'Internal Server Error' });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.put('/updatepointsbloquants/:intituleduprojet/:numpointblocant', upload.single('image'), async (req, res) => {
    const { intituleduprojet, numpointblocant } = req.params;
    const { pointbloquant, datenotif, datetraitement, commentaire } = req.body;

    try {
        const project = await ProjectModel.findOne({ intituleduprojet });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const avancementProject = await AvancementProjectModel.findOne({ Projet: project._id });
        if (!avancementProject) {
            return res.status(404).json({ error: 'AvancementProject not found' });
        }

        const pointblocantIndex = avancementProject.PointsBloquants.findIndex(item => item.num === parseInt(numpointblocant));
        if (pointblocantIndex === -1) {
            return res.status(404).json({ error: 'pointblocant item not found' });
        }

        avancementProject.PointsBloquants[pointblocantIndex].pointbloquant = pointbloquant;
        avancementProject.PointsBloquants[pointblocantIndex].datenotif = datenotif;
        avancementProject.PointsBloquants[pointblocantIndex].datetraitement = datetraitement;
        avancementProject.PointsBloquants[pointblocantIndex].commentaire = commentaire;
        

        await avancementProject.save();

        return res.status(200).json({ message: 'EtatAvancement updated successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/deletepointsbloquants/:intituleduprojet/:numpointbloquant', async (req, res) => {
    const { intituleduprojet, numpointbloquant } = req.params;

    try {
        const project = await ProjectModel.findOne({ intituleduprojet });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const avancementProject = await AvancementProjectModel.findOne({ Projet: project._id });
        if (!avancementProject) {
            return res.status(404).json({ error: 'AvancementProject not found' });
        }

        const pointsBloquantsIndex = avancementProject.PointsBloquants.findIndex(item => item.num === parseInt(numpointbloquant));
        if (pointsBloquantsIndex === -1) {
            return res.status(404).json({ error: 'PointsBloquants item not found' });
        }

        avancementProject.PointsBloquants.splice(pointsBloquantsIndex, 1);

        await avancementProject.save();

        return res.status(200).json({ message: 'PointsBloquants item deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

//ListProjects

app.get('/listinfosproject/:intituleduprojet', (req, res) => {
    const { intituleduprojet } = req.params;

    ProjectModel.findOne({ intituleduprojet }) 
        .then(project => {
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            const {
                descriptif,
                prestataire,
                dateodcbp,
                datefinalprevis, 
                createur
            } = project; 

            res.json({
                descriptif,
                prestataire,
                dateodcbp,
                datefinalprevis,
                createur
            });
        })
        .catch(err => res.status(500).json({ error: 'Internal Server Error' }));
});

app.put('/listinfosproject/:intituleduprojet', async (req, res) => {
    const { intituleduprojet } = req.params;
    const updatedInfo = req.body; 

    try {
        const project = await ProjectModel.findOneAndUpdate(
            { intituleduprojet },
            updatedInfo,
            { new: true } 
        );

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        console.log('Project information updated:', project);
        return res.status(200).json(project);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//list Projects
app.get('/listprojects', async (req, res) => {
    // Retrieve the user ID from the JWT token
    const token = req.cookies.token;
    console.log(token);
    jwt.verify(token, "jwt-secret-key", async (err, decoded) => {
      if (err) {
        return res.json({ status: 'Error', message: 'Error with token' });
      } else {
        const createurEmail = decoded.email; 
  
        try {
          const user = await UserModel.findOne({ email: createurEmail });
  
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
  
          const projects = await ProjectModel.find({ createur: user._id });
  
          const projectsWithAvancement = [];
  
          for (const project of projects) {
            const avancementProject = await AvancementProjectModel.findOne({ Projet: project._id });

            if (avancementProject) {
              projectsWithAvancement.push({
                project,
                avancementProject: avancementProject.pourcentageAvancementProjet
              });
            }
          }
          console.log(projectsWithAvancement)
          res.json({ success: true, projectsWithAvancement });
        } catch (err) {
          console.error(err);
          res.status(500).json({ success: false, message: 'Failed to fetch projects' });
        }
      }
    });
  });
  



app.delete('/deletelistprojects/:intituleduprojet', async (req, res) => {
    const { intituleduprojet } = req.params;

    try {
        const deletedProject = await ProjectModel.findOneAndDelete({ intituleduprojet });
        if (!deletedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const usersWithProject = await UserModel.find({ projects: deletedProject._id });

        for (const user of usersWithProject) {
            user.projects.pull(deletedProject._id);
            await user.save();
        }

        await AvancementProjectModel.deleteMany({ Projet: deletedProject._id });

        return res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.post('/informations', async (req, res) => {
    const { intituleduprojet, descriptif, prestataire, dateodcbp, datefinalprevis } = req.body;

    if (!intituleduprojet || !descriptif || !prestataire || !dateodcbp || !datefinalprevis) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, "jwt-secret-key");
        const createurEmail = decoded.email; // Extract the user's email from the decoded token

        const user = await UserModel.findOne({ email: createurEmail });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const project = await ProjectModel.create({
            intituleduprojet,
            descriptif,
            prestataire,
            dateodcbp,
            datefinalprevis,
            createur: user._id // Assign the createur value to the user's _id
        });

        const avancementProject = await AvancementProjectModel.create({
            Projet: project._id, // Assign the project's _id to the Projet field
            pourcentageAvancementProjet: "0%", // Set pourcentageAvancementProjet to 0%
        });

        user.projects.push(project._id);
        await user.save();

        res.json({ status: 'Success', project, avancementProject });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





app.get('/informations', (req, res) => {
    res.json("Success")
})

app.get('/ordrearret/:intituleduprojet', (req, res) => {
    const { intituleduprojet } = req.params;

    ProjectModel.findOne({ intituleduprojet }) // Find the project by intituleduprojet
        .then(project => {
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            const ordrearret = project.ordrearret; 
            console.log(ordrearret); 
            res.json(ordrearret);
        })
        .catch(err => res.status(500).json({ error: 'Internal Server Error' }));
});

app.get('/createordrearret/:intituleduprojet/:numordrearret', (req, res) => {
    res.json("Success")
})


app.post('/createordrearret/:intituleduprojet', async (req, res) => {
    const { intituleduprojet } = req.params;
    const { datearret, cause, datereprise, commentaire } = req.body;

    try {
        const token = req.cookies.token;
        const userRole = await getUserRoleFromToken(token); // Retrieve user's role
        
        const project = await ProjectModel.findOne({ intituleduprojet: intituleduprojet });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        project.ordrearret.push({
            num: project.ordrearret.length + 1,
            datearret,
            cause,
            datereprise,
            commentaire
        });

        await project.save();

        return res.status(200).json({ 
            message: 'Ordrearret added successfully',
            userRole: userRole // Include user's role in the response
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.get('/updateordrearret/:intituleduprojet/:numordrearret', (req, res) => {
    const { intituleduprojet, numordrearret } = req.params;

    ProjectModel.findOne({ intituleduprojet }) // Find the project by intituleduprojet
        .then(project => {
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            const ordrearretItem = project.ordrearret.find(item => item.num === parseInt(numordrearret));
            if (!ordrearretItem) {
                return res.status(404).json({ error: 'Ordrearret item not found' });
            }

            console.log(ordrearretItem); // Log the specific ordrearret item to the console
            res.json(ordrearretItem);
        })
        .catch(err => res.status(500).json({ error: 'Internal Server Error' }));
});

app.put('/updateordrearret/:intituleduprojet/:numordrearret', async (req, res) => {
    const { intituleduprojet, numordrearret } = req.params;
    const { datearret, cause, datereprise, commentaire } = req.body;

   

    try {
        const token = req.cookies.token;
        const userRole = await getUserRoleFromToken(token);

        const project = await ProjectModel.findOne({ intituleduprojet });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const ordrearretIndex = project.ordrearret.findIndex(item => item.num === parseInt(numordrearret));
        if (ordrearretIndex === -1) {
            return res.status(404).json({ error: 'Ordrearret item not found' });
        }

        project.ordrearret[ordrearretIndex] = {
            num: parseInt(numordrearret),
            datearret,
            cause,
            datereprise,
            commentaire
        };

        await project.save();
       
        return res.status(200).json({
            message: 'Ordrearret updated successfully',
            userRole: userRole
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.delete('/deleteordrearret/:intituleduprojet/:numordrearret', async (req, res) => {
    const { intituleduprojet, numordrearret } = req.params;

    try {
        const project = await ProjectModel.findOne({ intituleduprojet });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const ordrearretIndex = project.ordrearret.findIndex(item => item.num === parseInt(numordrearret));
        if (ordrearretIndex === -1) {
            return res.status(404).json({ error: 'Ordrearret item not found' });
        }

        project.ordrearret.splice(ordrearretIndex, 1);

        await project.save();

        return res.status(200).json({ message: 'Ordrearret deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.get('/bordprix/:intituleduprojet', (req, res) => {
    const { intituleduprojet } = req.params;

    ProjectModel.findOne({ intituleduprojet }) 
        .then(project => {
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            const bordprix = project.bordprix; // Extract the bordprix data from the project
            console.log(bordprix); // Log the bordprix data to the console
            res.json(bordprix);
        })
        .catch(err => res.status(500).json({ error: 'Internal Server Error' }));
});



app.post('/createbordprix/:intituleduprojet', async (req, res) => {
    const { intituleduprojet } = req.params;
    const { designation, U, quantity, pu, pt } = req.body;

    if (!designation || !U || !quantity || !pu || !pt) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    try {
        const token = req.cookies.token;
        const userRole = await getUserRoleFromToken(token); // Retrieve user's role

        const project = await ProjectModel.findOne({ intituleduprojet: intituleduprojet });

        if (!project) {
            return res.status(404).json({ message: 'project not found' });
        }

        // Append the new bordprix object to the bordprix array
        project.bordprix.push({
            num: project.bordprix.length + 1,
            designation,
            U,
            quantity,
            pu,
            pt
        });

        await project.save();

        // Create a corresponding entry in EtatAvancement array
        const avancementProject = await AvancementProjectModel.findOne({ Projet: project._id })
        
        if (!avancementProject) {
            const errorMessage = `AvancementProject not found for intituleduprojet: ${intituleduprojet}`;
            console.error(errorMessage);
            return res.status(404).json({ error: errorMessage });
        }

        avancementProject.EtatAvancement.push({
            num: project.bordprix.length,
            designation,
            U,
            quantity,
            quantityrealised: 0,
            montanttotal: pt,
            montantrealised: 0
        });

        await avancementProject.save();

        return res.status(200).json({ 
            message: 'Bordprix added successfully',
            userRole: userRole // Include user's role in the response
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});





app.get('/createbordprix/:intituleduprojet', (req, res) => {
    res.json("Success")
})

app.put('/updatebordprix/:intituleduprojet/:numbordprix', async (req, res) => {
    const { intituleduprojet, numbordprix } = req.params;
    const { designation, U, quantity, pu, pt } = req.body;

    if (!designation || !U || !quantity || !pu || !pt) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    try {

        const token = req.cookies.token;
        const userRole = await getUserRoleFromToken(token);

        const project = await ProjectModel.findOne({ intituleduprojet });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const bordprixIndex = project.bordprix.findIndex(item => item.num === parseInt(numbordprix));
        if (bordprixIndex === -1) {
            return res.status(404).json({ error: 'Bordprix item not found' });
        }

        project.bordprix[bordprixIndex] = {
            num: parseInt(numbordprix),
            designation,
            U,
            quantity,
            pu,
            pt
        };

        // Save the updated project document
        await project.save();

        const avancementProject = await AvancementProjectModel.findOne({ Projet: project._id });
        if (avancementProject) {
            avancementProject.EtatAvancement.forEach(item => {
                if (item.num === parseInt(numbordprix)) {
                    item.designation = designation;
                    item.U = U;
                    item.quantity = quantity;
                    item.montanttotal = pt; // Update montanttotal to pt
                    item.montantrealised = item.quantityrealised * pu
                }
            });
            await avancementProject.save();
        }

        return res.status(200).json({ 
            message: 'Bordprix and EtatAvancement updated successfully',
            userRole: userRole // Include user's role in the response
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/updatebordprix/:intituleduprojet/:numbordprix', (req, res) => {
    const { intituleduprojet, numbordprix } = req.params;

    ProjectModel.findOne({ intituleduprojet }) 
        .then(project => {
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            const bordprixItem = project.bordprix.find(item => item.num === parseInt(numbordprix));
            if (!bordprixItem) {
                return res.status(404).json({ error: 'Bordprix item not found' });
            }

            console.log(bordprixItem); 
            res.json(bordprixItem);
        })
        .catch(err => res.status(500).json({ error: 'Internal Server Error' }));
});

app.delete('/deletebordprix/:intituleduprojet/:numbordprix', async (req, res) => {
    const { intituleduprojet, numbordprix } = req.params;

    try {
        const project = await ProjectModel.findOne({ intituleduprojet });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const bordprixIndex = project.bordprix.findIndex(item => item.num === parseInt(numbordprix));
        if (bordprixIndex === -1) {
            return res.status(404).json({ error: 'Bordprix item not found' });
        }

        const deletedBordprix = project.bordprix.splice(bordprixIndex, 1);

        await project.save();

        const avancementProject = await AvancementProjectModel.findOne({ Projet: project._id });
        if (avancementProject) {
            avancementProject.EtatAvancement = avancementProject.EtatAvancement.filter(item => item.num !== parseInt(numbordprix));
            await avancementProject.save();
        }

        return res.status(200).json({ message: 'Bordprix and corresponding EtatAvancement deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getuserrole', async (req, res) => {
    try {
        const token = req.cookies.token; 
      if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
      }
  
      const userRole = await getUserRoleFromToken(token);
      res.status(200).json({ role: userRole });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
//------------------------------Admin Zone -------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------
app.put('/changeresponsableprojet/:projectId',varifyUserAdmin ,async (req, res) => {
    try{
        const { projectId } = req.params;
        const { responsibleUserId } = req.body;

        const project = await ProjectModel.findById(projectId);
        console.log(projectId)

        if (!project) {
            return res.status(586).json({ success: false, message: 'Project not found' });
        }

        const previouscreateur = project.createur
        const previousUser = await UserModel.findById(previouscreateur);
        if (!previousUser) {
            return res.status(963).json({ success: false, message: 'User not found' });
        }
        previousUser.projects.pull(projectId);
        await previousUser.save();

        const newUser = await UserModel.findById(responsibleUserId);
        if (!newUser) {
            return res.status(963).json({ success: false, message: 'User not found' });
        }
        newUser.projects.push(projectId);
        await newUser.save();

        project.createur = responsibleUserId;
        await project.save();
        return res.status(200).json({ success: true, message: 'Responsible project updated successfully', updatedProject: project });
    }catch(error){
        console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch data' });
    }
    
  }
)

app.get('/projectslist', varifyUserAdmin, async (req, res) => {
    try {
        // Find all projects and populate the 'createur' field with user details
        const projects = await ProjectModel.find({}).populate('createur', 'name email');
        
        const numberOfProjects = projects.length;
        console.log(projects)
        
        res.json({ success: true, numberOfProjects, projects });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Failed to fetch projects' });
    }
});


app.get('/userslist', varifyUserAdmin, async (req, res) => {
    try {
        const users = await UserModel.find({})
            .populate({
                path: 'projects',
                select: 'intituleduprojet',
                populate: {
                    path: 'createur',
                    select: 'name',
                },
            });

        const usersWithProjectCount = users.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            projectCount: user.projects.length,
        }));

        const numberOfUsers = usersWithProjectCount.length;

        res.json({ success: true, numberOfUsers, users: usersWithProjectCount });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
});

app.get('/projectdetails/:intituleduprojet', async (req, res) => {
    try {
      const { intituleduprojet } = req.params;
  
      const projectData = await ProjectModel.findOne({ intituleduprojet })
        .populate('createur', 'name') // Populate the creator's name
  
      if (!projectData) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
  
      res.json({ success: true, projectData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch project details' });
    }
});
  
app.post('/createprojectadmin', async (req, res) => {
    const { intituleduprojet, descriptif, prestataire, dateodcbp, datefinalprevis, createur } = req.body;

    if (!intituleduprojet || !descriptif || !prestataire || !dateodcbp || !datefinalprevis || !createur) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    try {
        const user = await UserModel.findById(createur);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const project = await ProjectModel.create({
            intituleduprojet,
            descriptif,
            prestataire,
            dateodcbp,
            datefinalprevis,
            createur: user._id // Assign the createur value to the user's _id
        });

        user.projects.push(project._id);
        await user.save();

        const avancementProject = await AvancementProjectModel.create({
            Projet: project._id, // Assign the project's _id to the Projet field
            pourcentageAvancementProjet: "0%",
        });

        res.json({ status: 'Success', project, avancementProject });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.delete('/deleteproject/:projectId', varifyUserAdmin, async (req, res) => {
    try {
        const projectId = req.params.projectId;

        const project = await ProjectModel.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        const usersWithProject = await UserModel.find({ projects: projectId });

        for (const user of usersWithProject) {
            user.projects.pull(projectId);
            await user.save();
        }

        await AvancementProjectModel.deleteMany({ Projet: project._id });

        await ProjectModel.findByIdAndDelete(projectId);

        res.json({ success: true, message: 'Project and associated AvancementProject deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete project' });
    }
});


//8/28

app.delete('/deleteuser/:userId', varifyUserAdmin, async (req, res) => {
    try {
        const userId = req.params.userId;

        const userProjects = await ProjectModel.find({ createur: userId });

        for (const project of userProjects) {
            // Delete the associated AvancementProject documents for each project
            await AvancementProjectModel.deleteMany({ Projet: project._id });
        }

        await ProjectModel.deleteMany({ createur: userId });

        await UserModel.findByIdAndDelete(userId);

        res.json({ success: true, message: 'User, associated projects, and AvancementProjects deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete user and associated projects' });
    }
});



app.get('/getUserInfoAdmin/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const projects = await ProjectModel.find({ createur: user._id });

        const projectsWithAvancement = [];

        for (const project of projects) {
            const avancementProject = await AvancementProjectModel.findOne({ Projet: project._id });

            if (avancementProject) {
                projectsWithAvancement.push({
                    _id: project._id,
                    intituleduprojet: project.intituleduprojet,
                    descriptif: project.descriptif,
                    pourcentageAvancementProjet: avancementProject.pourcentageAvancementProjet,
                });
            }
        }

        const userDetails = {
            _id: user._id,
            name: user.name,
            email: user.email,
            projectCount: projectsWithAvancement.length,
            projects: projectsWithAvancement,
        };

        res.json({ success: true, userDetails });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Failed to fetch user details' });
    }
});

  
app.get('/projectaddition', varifyUserVisitor, (req, res) => {
    res.json("Success")
})


app.get('/dashboard', varifyUserAdmin, (req, res) => {
    res.json("Success")
})

app.get('/countavancement', async (req, res) => {
    try {
        const currentDate = new Date();
        console.log('Current Date:', currentDate);

        const result = await AvancementProjectModel.aggregate([
            {
                $match: {
                    pourcentageAvancementProjet: { $ne: "100.00%" }
                }
            },
            {
                $lookup: {
                    from: 'projects', // Assuming the collection name is 'projects'
                    localField: 'Projet',
                    foreignField: '_id',
                    as: 'project'
                }
            },
            {
                $match: {
                    "project.datefinalprevis": { $lt: currentDate }
                  }
            },
            {
                $count: 'countNot100Percent'
            }
        ]);

        const countNot100Percent = result.length > 0 ? result[0].countNot100Percent : 0;

        const count100Percent = await AvancementProjectModel.countDocuments({
            pourcentageAvancementProjet: "100.00%"
        });

        res.json({
            success: true,
            countNot100Percent,
            count100Percent,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to count AvancementProjects',
        });
    }
});

app.get('/latestprojects', async (req, res) => {
    try {
        const currentDate = new Date();
        const latestProjects = await ProjectModel.find({})
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the latest projects first 

        const projectsWithAvancement = [];

        for (const project of latestProjects) {
            const avancementProject = await AvancementProjectModel.findOne({ Projet: project._id });

            if (avancementProject) {
                const montantRealisedSum = avancementProject.EtatAvancement.reduce((sum, etat) => sum + etat.montantrealised, 0);
                const montantTotalSum = avancementProject.EtatAvancement.reduce((sum, etat) => sum + etat.montanttotal, 0);
                const pointsBlocantsCount = avancementProject.PointsBloquants.length;
                const ordreArretCount = project.ordrearret.length;

                const timeDifferenceMilliseconds = project.datefinalprevis - currentDate;
                const timeLeftInDays = Math.ceil(timeDifferenceMilliseconds / (1000 * 60 * 60 * 24));


                projectsWithAvancement.push({
                    project,
                    avancementProject: {
                        ...avancementProject.toObject(),
                        montantRealisedSum,
                        montantTotalSum,
                        pointsBlocantsCount,
                        ordreArretCount,
                        pourcentageAvancementProjet : avancementProject.pourcentageAvancementProjet,
                        timeLeftInDays: timeLeftInDays > 0 ? timeLeftInDays : 'En Retard!',
                    }
                });
                console.log(timeLeftInDays);
            }
        }
        res.json({ success: true, latestProjects: projectsWithAvancement });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch latest projects' });
    }
});


  
app.get('/userprojectsavancement', varifyUserAdmin, async (req, res) => {
    try {
      const currentDate = new Date()
      const allUsers = await UserModel.find();
  
      const userData = [];
  
      for (const user of allUsers) {
        const projectCount = user.projects.length;
  
        const userProjects = [];
  
        let count100PercentProjects = 0;
        let countNot100PercentProjects = 0;
  
        for (const projectId of user.projects) {
          const project = await ProjectModel.findById(projectId);
  
          if (project) {
            const avancementProject = await AvancementProjectModel.findOne({
              Projet: projectId,
            });
  
            if (avancementProject) {
              userProjects.push({
                project,
                avancementProject: avancementProject.pourcentageAvancementProjet,
              });
  
              if (avancementProject.pourcentageAvancementProjet === "100.00%") {
                count100PercentProjects++;
              } else if (
                project.datefinalprevis &&
                project.datefinalprevis <= currentDate // Check if datefinalprevis is less than or equal to currentDate
              ) {
                countNot100PercentProjects++;
              }
            }
          }
        }
  
        userData.push({
          user,
          projectCount,
          count100PercentProjects,
          countNot100PercentProjects,
          userProjects,
        });
      }
  
      res.json({
        success: true,
        userData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch data' });
    }
  });
  
  app.get('/reportpage/:intituleduprojet', async (req, res) => {
    try {
        const { intituleduprojet } = req.params;

        const project = await ProjectModel.findOne({ intituleduprojet }).populate('createur');

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${intituleduprojet}_report.pdf"`);

        doc.pipe(res);

        doc.fontSize(16).text('Project Report', { align: 'center' });
        doc.fontSize(14).text(`Project Title: ${project.intituleduprojet}`);
        doc.fontSize(14).text(`Project Description: ${project.descriptif}`);

        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});  
  
  
  
  



app.get('/home', varifyUserVisitor, (req, res) => {
    res.json("Success")
})

app.post('/register', (req, res) => {
    const {name, email, password} = req.body
    bcrypt.hash(password, 10)
    .then(hash => {
        UserModel.create({name, email, password: hash})
        .then(user => res.json("Success"))
        .catch(err => res.json(err))
    }).catch(err => res.json(err))
})

app.post('/', (req, res) => {
    const { email, password } = req.body
    UserModel.findOne({email: email})
    .then(user => {
        if (user) {
            bcrypt.compare(password, user.password, (err, response) => {
                if(response){
                    const token = jwt.sign({email: user.email, role: user.role},
                         "jwt-secret-key", {expiresIn: '1d'})
                    res.cookie('token', token)
                    return res.json({Status: "Success", role: user.role , userId: user._id})
                }else{
                    return res.json("The password is incorrect")
                }
            })
        } else {
            return res.json("No record existed")
        }
    })
})



app.listen(3001, () => {
    console.log("Server is Running")
})
const Forcast = require('../models/forcastModel.js')
var MongoClient = require('mongodb').MongoClient;
let url = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PW}@${process.env.ATLAS_URL}?retryWrites=true&w=majority`

//Create new Forcast
exports.create = (req, res) => {
    //Need to validate req
    if(!req.body.location && !req.body.forcast && !req.body.degree){
        return res.status(400).send({
            message: "Location or Forcast connot be blank"
        })
    }

    //Create Forcast
    const forcastCreate = new Forcast({
        location: req.body.location,
        degree: req.body.degree,
        forcast: req.body.forcast
    })

    //Save forcast
    forcastCreate.save()
    .then( data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            message: err.message || "An Error has occurred"
        })
    })

};

// Retrieve all forcasts
exports.findAll = (req, res) => {
    Forcast.find()
    .then(forcasts => {
        res.send(forcasts);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving forcasts."
        });
    });
};


//Retrieve one forcast
exports.findOne = (req, res) => {
    Forcast.findById(req.params.forcastId)
    .then(forcast => {
        if(!forcast) {
            return res.status(404).send({
                message: "Forcast not found with id " + req.params.forcastId
            });            
        }
        res.send(forcast);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "forcast not found with id " + req.params.forcastId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving forcast with id " + req.params.forcastId
        });
    });
};

//Query DB for City forcasts
exports.queryOne = (req , res) => {
    Forcast.find({location : `${req.query.cityName}` },{__v:0,_id:0 })
    .then(queryResult => {
         res.send(queryResult)
    }).catch(err => {
        if(err){
            console.log('Error: '+ err)
            res.send(err)
        }
    })
}
 
//Update a Forcast
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.location && !req.body.forcast && !req.body.degrees) {
        return res.status(400).send({
            message: "Forcast or Location can not be empty"
        });
    }

    // Find forcast and update it with the request body
    Forcast.findByIdAndUpdate(req.params.forcastId, {
        location: req.body.location,
        degree: req.body.degree,
        forcast: req.body.forcast
    }, {new: true})
    .then(forcast => {
        if(!forcast) {
            return res.status(404).send({
                message: "forcast not found with id " + req.params.forcastId
            });
        }
        res.send(forcast);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "forcast not found with id " + req.params.forcastId
            });                
        }
        return res.status(500).send({
            message: "Error updating forcast with id " + req.params.forcastId
        });
    });
};

//Delete a Forcast
exports.delete = (req, res) => {
    Forcast.findByIdAndRemove(req.params.forcastId)
    .then(forcast => {
        if(!forcast) {
            return res.status(404).send({
                message: "forcast not found with id " + req.params.forcastId
            });
        }
        res.send({message: "forcast deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "forcast not found with id " + req.params.forcastId
            });                
        }
        return res.status(500).send({
            message: "Could not delete forcast with id " + req.params.forcastId
        });
    });
};

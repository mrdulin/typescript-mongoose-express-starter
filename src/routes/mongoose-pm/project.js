var express = require('express');
var router = express.Router();
var Project = require(__base + 'models/mongoose-pm/Project');

router
    .route('/new')
    .get(function (req, res, next) {
        if (req.cookies.logined) {
            res.render('./mongoose-pm/project_form.jade', {
                title: 'Create project',
                projectName: '',
                projectId: '',
                userId: req.cookies.user._id,
                username: req.cookies.user.name,
                tasks: '',
                buttonText: 'create'
            });
        } else {
            res.redirect('/mongoose-pm/login');
        }
    })
    .post(function (req, res, next) {
        new Project({
            projectName: req.body.projectName,
            tasks: req.body.tasks,
            createdBy: req.cookies.user._id,
            modifiedOn: Date.now()
        }).save(function (err, project) {
            if (err) {
                if (err === 11000) {
                    res.redirect('/mongoose-pm/project/new?error=true');
                } else {
                    res.redirect('/mongoose-pm/?error=true');
                }
            } else {
                console.log('create project is: ', project);
                res.redirect('/mongoose-pm/user');
            }
        });
    })

router
    .get('/:id', function (req, res, next) {
        if (req.params.id) {
            Project
                .findById(req.params.id)
                .populate('createdBy', 'name email')
                .exec(function (err, project) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('project is: ', project);
                        res.render('./mongoose-pm/project_page.jade', {
                            projectName: project.projectName,
                            //createdBy: project.createdBy,
                            tasks: project.tasks,
                            projectId: req.params.id,
                            username: project.createdBy.name,
                            email: project.createdBy.email
                        });
                    }
                });
        } else {
            console.log('project id must be supplied');
            res.redirect('/mongoose-pm/user');
        }
    })

router
    .route('/edit/:id')
    .get(function (req, res, next) {
        if (req.params.id) {
            Project.findById(req.params.id, function (err, project) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('project is: ', project);
                    res.render('./mongoose-pm/project_form.jade', {
                        title: "Edit project",
                        userId: req.cookies.user._id,
                        username: req.cookies.user.name,
                        projectName: project.projectName,
                        projectId: req.params.id,
                        tasks: project.tasks,
                        buttonText: 'edit'
                    });
                }
            });
        }
    })
    .post(function (req, res, next) {
        if (req.body.projectId) {
            Project.findById(req.body.projectId, function (err, project) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('project is: ', project);
                    project.projectName = req.body.projectName;
                    project.tasks = req.body.tasks;
                    project.modifiedOn = Date.now();
                    project.save(function (err, projectSaved) {
                        if (!err) {
                            console.log('project saved success');
                            res.redirect('/mongoose-pm/project/' + projectSaved._id);
                        }
                    })
                }
            });
        }
    })

router.route('/delete/:id')
    .get(function (req, res, next) {

    })
    .post(function (req, res, next) {

    })

router.get('/byuser/:userid', function (req, res, next) {
    var userid = req.params.userid;
    if (userid) {
        Project.findByUserId(userid, function (err, projects) {
            if (!err) {
                console.log(projects);
                res.json(projects);
            } else {
                console.log(err);
                res.json({ status: 'error', error: 'Error finding projects' });
            }
        });
    } else {
        console.log('No user id supplied');
        res.json({ status: 'error', error: 'No user id supplied' });
    }
});


module.exports = router;

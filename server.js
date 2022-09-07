const bodyParser = require('body-parser');
const exp = require('constants');
const express = require('express');
const request = require('request');
const app = express();
const Joi = require('joi');
const port = process.env.PORT || 8080;
const cors = require('cors');
const { isNull } = require('util');
const { resourceLimits } = require('worker_threads');
const MongoClient = require('mongodb').MongoClient;
const corsOptions = { origin: 'http://localhost:8080', credentials: true };
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
const methodOverride = require('method-override');
const { MongoUnexpectedServerResponseError } = require('mongodb');
const { type } = require('os');
app.use(methodOverride('_method'))
var db;
const dbconnection = MongoClient.connect('mongodb+srv://admin:1234@cluster0.rdtuh5c.mongodb.net/?retryWrites=true&w=majority', function(err, client) {
    if (err) {
        return console.log(err);
    }
    db = client.db('aoror');
    console.log("마리아디비가 열렸습니다.");
    app.listen(port, function() {
        console.log('succed');
    })
})
app.get('/', function(req, res) {
    db.collection("documents").find().sort({ _id: 1 }).toArray(async function(err, result1) {
        var mmx = (result1.length < 5) ? result1.length : 5;
        db.collection("concept").find().sort({ _id: 1 }).toArray(async function(err, result2) {
            var mmx2 = (result2.length < 5) ? result2.length : 5;
            await res.render("main.ejs", { documents: result1, concepts: result2, mmx, mmx2 });
        })
    })

})
app.get('/write', function(req, res) {
    res.render("write.ejs");
})

const schema = Joi.object().keys({
    numbers: Joi.number().min(1000).max(30000).required(),
    answer: Joi.string().required(),
    testcase: Joi.string().required()
});

const updateschema = Joi.object().keys({
    numbers: Joi.number().min(1000).max(30000).required(),
    tears: Joi.string().required(),
    name: Joi.string().required(),
    answer: Joi.string().required(),
    testcase: Joi.string().required()
});







app.post('/add', function(req, res) {
    db.collection('documents').findOne({ _id: parseInt(req.body.numbers) }, async function(err, result) {
        if (err) {
            return res.status(500).send("<h1>500</h1><br><h4>값을 추가 하지 못하였습니다. 서버 오류 발생</h4>");
        } else {

            if (result === '' || result === null) {
                try {
                    await schema.validateAsync(req.body);
                } catch (e) {
                    return res.status(400).send("<h1>400</h1><br><h4>올바른 값이 아닙니다.</h4>");
                }
                const options = {
                    method: 'GET',
                    url: 'https://solved.ac/api/v3/problem/show',
                    qs: { problemId: req.body.numbers },
                    headers: { 'Content-Type': 'application/json' }
                };
                request(options, function(error, response, solvedac) {
                    if (error) {
                        console.log(error);
                        return res.status(400).send("<h1>400</h1><br><h4>올바른 값이 아닙니다.</h4>");
                    }
                    if (solvedac != "Not Found") {
                        var tearbigtemp = "ERR";
                        var tearsmalltemp = "err";
                        solvedac = JSON.parse(solvedac);
                        console.log(solvedac.level);
                        if (solvedac.level == 0) {
                            tearbigtemp = "Unrated";
                            tearsmalltemp = "0";
                        } else if (solvedac.level >= 1 && solvedac.level <= 5) {
                            tearbigtemp = "Bronze";
                            if (solvedac.level % 5 == 0) {
                                tearsmalltemp = "Ⅰ";
                            } else if (solvedac.level % 5 == 1) {
                                tearsmalltemp = "Ⅴ";
                            } else if (solvedac.level % 5 == 2) {
                                tearsmalltemp = "Ⅳ";
                            } else if (solvedac.level % 5 == 3) {
                                tearsmalltemp = "Ⅲ";
                            } else {
                                tearsmalltemp = "Ⅱ";
                            }
                        } else if (solvedac.level >= 6 && solvedac.level <= 10) {
                            tearbigtemp = "Silver";
                            if (solvedac.level % 5 == 0) {
                                tearsmalltemp = "Ⅰ";
                            } else if (solvedac.level % 5 == 1) {
                                tearsmalltemp = "Ⅴ";
                            } else if (solvedac.level % 5 == 2) {
                                tearsmalltemp = "Ⅳ";
                            } else if (solvedac.level % 5 == 3) {
                                tearsmalltemp = "Ⅲ";
                            } else {
                                tearsmalltemp = "Ⅱ";
                            }
                        } else if (solvedac.level >= 11 && solvedac.level <= 15) {
                            tearbigtemp = "Gold";
                            if (solvedac.level % 5 == 0) {
                                tearsmalltemp = "Ⅰ";
                            } else if (solvedac.level % 5 == 1) {
                                tearsmalltemp = "Ⅴ";
                            } else if (solvedac.level % 5 == 2) {
                                tearsmalltemp = "Ⅳ";
                            } else if (solvedac.level % 5 == 3) {
                                tearsmalltemp = "Ⅲ";
                            } else {
                                tearsmalltemp = "Ⅱ";
                            }
                        } else if (solvedac.level >= 16 && solvedac.level <= 20) {
                            tearbigtemp = "Platinum";
                            if (solvedac.level % 5 == 0) {
                                tearsmalltemp = "Ⅰ";
                            } else if (solvedac.level % 5 == 1) {
                                tearsmalltemp = "Ⅴ";
                            } else if (solvedac.level % 5 == 2) {
                                tearsmalltemp = "Ⅳ";
                            } else if (solvedac.level % 5 == 3) {
                                tearsmalltemp = "Ⅲ";
                            } else {
                                tearsmalltemp = "Ⅱ";
                            }
                        } else if (solvedac.level >= 21 && solvedac.level <= 25) {
                            tearbigtemp = "Diamond";
                            if (solvedac.level % 5 == 0) {
                                tearsmalltemp = "Ⅰ";
                            } else if (solvedac.level % 5 == 1) {
                                tearsmalltemp = "Ⅴ";
                            } else if (solvedac.level % 5 == 2) {
                                tearsmalltemp = "Ⅳ";
                            } else if (solvedac.level % 5 == 3) {
                                tearsmalltemp = "Ⅲ";
                            } else {
                                tearsmalltemp = "Ⅱ";
                            }
                        } else if (solvedac.level >= 26 && solvedac.level <= 30) {
                            tearbigtemp = "Ruby";
                            if (solvedac.level % 5 == 0) {
                                tearsmalltemp = "Ⅰ";
                            } else if (solvedac.level % 5 == 1) {
                                tearsmalltemp = "Ⅴ";
                            } else if (solvedac.level % 5 == 2) {
                                tearsmalltemp = "Ⅳ";
                            } else if (solvedac.level % 5 == 3) {
                                tearsmalltemp = "Ⅲ";
                            } else {
                                tearsmalltemp = "Ⅱ";
                            }
                        }

                        if (solvedac.tags == '' || solvedac.tags == null) {
                            var tags = [];
                        } else {
                            var tags = [];
                            for (var i = 0; i < solvedac.tags.length; i++) {
                                tags.push(solvedac.tags[i].key);
                            }
                        }
                        console.log(tags);
                        db.collection('documents').insertOne({ _id: parseInt(req.body.numbers), name: solvedac.titleKo, tearbig: tearbigtemp, tearsmall: tearsmalltemp, answer: req.body.answer, testcase: req.body.testcase, tags: tags }, async function(err, result) {
                            await res.redirect('/alldic');
                        });
                    } else {
                        return res.status(400).send("<h1>400</h1><br><h4>그러한 문제는 없습니다.</h4>");
                    }
                });
            } else {
                return res.status(400).send("<h1>400</h1><br><h4>이미 있는 값입니다.</h4>");
            }
        }

    });

})

app.get('/find/:id', function(req, res) {
    db.collection("documents").findOne({ _id: parseInt(req.params.id) }, async function(err, result) {
        console.log(result);
        if (result == '' || result == null) {
            return res.status(404).send("<h1>404</h1><br><h4>올바른 값이 아닙니다.</h4>");
        } else {
            await res.render("find.ejs", { documents: result });
        }
    });
})

app.get('/edit/:id', function(req, res) {
    db.collection("documents").findOne({ _id: parseInt(req.params.id) }, async function(err, result) {
        if (result == '' || result == null) {
            return res.status(404).send("<h1>404</h1><br><h4>올바른 값이 아닙니다.</h4>");
        } else {
            await res.render("edit.ejs", { edits: result });
        }
    })
})

app.put('/edit', async function(req, res) {
    try {
        await updateschema.validateAsync(req.body);
    } catch (e) {
        console.log("2");
        return res.status(400).send("<h1>400</h1><br><h4>올바른 값이 아닙니다.</h4>");
    }
    const options = {
        method: 'GET',
        url: 'https://solved.ac/api/v3/problem/show',
        qs: { problemId: req.body.numbers },
        headers: { 'Content-Type': 'application/json' }
    };
    request(options, function(error, response, solvedac) {
        if (error) {
            console.log(error);
            return res.status(400).send("<h1>400</h1><br><h4>올바른 값이 아닙니다.</h4>");
        }
        if (solvedac != "Not Found") {
            var tearbigtemp = "ERR";
            var tearsmalltemp = "err";
            solvedac = JSON.parse(solvedac);
            console.log(solvedac.level);
            if (solvedac.level == 0) {
                tearbigtemp = "Unrated";
                tearsmalltemp = "0";
            } else if (solvedac.level >= 1 && solvedac.level <= 5) {
                tearbigtemp = "Bronze";
                if (solvedac.level % 5 == 0) {
                    tearsmalltemp = "Ⅰ";
                } else if (solvedac.level % 5 == 1) {
                    tearsmalltemp = "Ⅴ";
                } else if (solvedac.level % 5 == 2) {
                    tearsmalltemp = "Ⅳ";
                } else if (solvedac.level % 5 == 3) {
                    tearsmalltemp = "Ⅲ";
                } else {
                    tearsmalltemp = "Ⅱ";
                }
            } else if (solvedac.level >= 6 && solvedac.level <= 10) {
                tearbigtemp = "Silver";
                if (solvedac.level % 5 == 0) {
                    tearsmalltemp = "Ⅰ";
                } else if (solvedac.level % 5 == 1) {
                    tearsmalltemp = "Ⅴ";
                } else if (solvedac.level % 5 == 2) {
                    tearsmalltemp = "Ⅳ";
                } else if (solvedac.level % 5 == 3) {
                    tearsmalltemp = "Ⅲ";
                } else {
                    tearsmalltemp = "Ⅱ";
                }
            } else if (solvedac.level >= 11 && solvedac.level <= 15) {
                tearbigtemp = "Gold";
                if (solvedac.level % 5 == 0) {
                    tearsmalltemp = "Ⅰ";
                } else if (solvedac.level % 5 == 1) {
                    tearsmalltemp = "Ⅴ";
                } else if (solvedac.level % 5 == 2) {
                    tearsmalltemp = "Ⅳ";
                } else if (solvedac.level % 5 == 3) {
                    tearsmalltemp = "Ⅲ";
                } else {
                    tearsmalltemp = "Ⅱ";
                }
            } else if (solvedac.level >= 16 && solvedac.level <= 20) {
                tearbigtemp = "Platinum";
                if (solvedac.level % 5 == 0) {
                    tearsmalltemp = "Ⅰ";
                } else if (solvedac.level % 5 == 1) {
                    tearsmalltemp = "Ⅴ";
                } else if (solvedac.level % 5 == 2) {
                    tearsmalltemp = "Ⅳ";
                } else if (solvedac.level % 5 == 3) {
                    tearsmalltemp = "Ⅲ";
                } else {
                    tearsmalltemp = "Ⅱ";
                }
            } else if (solvedac.level >= 21 && solvedac.level <= 25) {
                tearbigtemp = "Diamond";
                if (solvedac.level % 5 == 0) {
                    tearsmalltemp = "Ⅰ";
                } else if (solvedac.level % 5 == 1) {
                    tearsmalltemp = "Ⅴ";
                } else if (solvedac.level % 5 == 2) {
                    tearsmalltemp = "Ⅳ";
                } else if (solvedac.level % 5 == 3) {
                    tearsmalltemp = "Ⅲ";
                } else {
                    tearsmalltemp = "Ⅱ";
                }
            } else if (solvedac.level >= 26 && solvedac.level <= 30) {
                tearbigtemp = "Ruby";
                if (solvedac.level % 5 == 0) {
                    tearsmalltemp = "Ⅰ";
                } else if (solvedac.level % 5 == 1) {
                    tearsmalltemp = "Ⅴ";
                } else if (solvedac.level % 5 == 2) {
                    tearsmalltemp = "Ⅳ";
                } else if (solvedac.level % 5 == 3) {
                    tearsmalltemp = "Ⅲ";
                } else {
                    tearsmalltemp = "Ⅱ";
                }
            }
            db.collection("documents").updateOne({ _id: parseInt(req.body.numbers) }, { $set: { tearbig: tearbigtemp, tearsmall: tearsmalltemp, answer: req.body.answer, testcase: req.body.testcase } }, async function(err, result) {
                if (err) {
                    return res.status(500).send("<h1>500</h1><br><h4>값을 업데이트 하지 못하였습니다. 서버 오류 발생</h4>");
                } else {
                    console.log("업데이트 되었습니다");
                    await res.redirect('/alldic');
                }
            })
        } else {
            return res.status(400).send("<h1>400</h1><br><h4>그러한 문제는 없습니다.</h4>");
        }
    });
})

app.post('/finder', function(req, res) {
    console.log(req.body);
    if (req.body.searcher != '') {
        res.redirect('/find/' + req.body.searcher);
    } else {
        return res.status(404).send("<h1>404</h1><br><h4>그런 값이 없습니다.</h4>");
    }
})

app.get('/alldic', function(req, res) {
    db.collection("documents").find().sort({ _id: 1 }).toArray(async function(err, result) {
        res.render("alldic.ejs", { documents: result });
    })
})
app.get('/allcon', function(req, res) {
    db.collection("concept").find().sort({ _id: 1 }).toArray(async function(err, result) {
        res.render("allcon.ejs", { documents: result });
    })
})


const conschema = Joi.object().keys({
    conceptid: Joi.string().required(),
    conception: Joi.string().required(),
    conceptcode: Joi.string().required(),
});;

app.post('/addcon', function(req, res) {
    db.collection('concept').findOne({ _id: req.body.conceptid }, async function(err, result) {
        if (err) {
            return res.status(500).send("<h1>500</h1><br><h4>값을 추가 하지 못하였습니다. 서버 오류 발생</h4>");
        } else {
            if (result === '' || result === null) {
                try {
                    await conschema.validateAsync(req.body);
                } catch (e) {
                    return res.status(400).send("<h1>400</h1><br><h4>올바른 값이 아닙니다.</h4>");
                }
                const options = {
                    method: 'GET',
                    url: 'https://solved.ac/api/v3/search/tag',
                    qs: { query: req.body.conceptid },
                    headers: { 'Content-Type': 'application/json' }
                };
                request(options, function(error, response, solvedac) {
                    if (error) {
                        console.log(error);
                        return res.status(400).send("<h1>400</h1><br><h4>올바른 값이 아닙니다.</h4>");
                    }
                    solvedac = JSON.parse(solvedac);
                    if (solvedac.count == 0) {
                        return res.status(400).send("<h1>400</h1><br><h4>그러한 개념은 없거나 비슷한 개념아이디가 존재합니다. 개념아이디를 다시 한번 확인하여 주시기 바랍니다. </h4>");
                    }
                    var find = 0;
                    for (var i = 0; i < solvedac.items.length; i++) {
                        console.log(solvedac.items[i].key);
                        if (solvedac.items[i].key == req.body.conceptid) {
                            db.collection('concept').insertOne({ _id: req.body.conceptid, koid: solvedac.items[i].displayNames[0].name, conception: req.body.conception, code: req.body.conceptcode }, async function(err, result) {
                                await res.redirect('/allcon');
                            });
                            find = 1;
                            break;
                        }
                    }
                    if (find == 0) {
                        return res.status(400).send("<h1>400</h1><br><h4>그러한 개념은 없거나 비슷한 개념아이디가 존재합니다. 개념아이디를 다시 한번 확인하여 주시기 바랍니다. </h4>");
                    }


                });
            } else {
                return res.status(400).send("<h1>400</h1><br><h4>이미 있는 값입니다.</h4>");
            }
        }

    });

})

app.get('/writecon', function(req, res) {
    res.render("writecon.ejs");
})



app.get('/editcon/:id', function(req, res) {
    db.collection("concept").findOne({ _id: req.params.id }, async function(err, result) {
        if (result == '' || result == null) {
            return res.status(404).send("<h1>404</h1><br><h4>올바른 값이 아닙니다.</h4>");
        } else {
            await res.render("editcon.ejs", { edits: result });
        }

    })
})
app.get('/findcon/:id', function(req, res) {
    db.collection("concept").findOne({ _id: req.params.id }, async function(err, result) {
        if (result == '' || result == null) {
            return res.status(404).send("<h1>404</h1><br><h4>올바른 값이 아닙니다.</h4>");
        } else {
            await res.render("findcon.ejs", { documents: result });
        }
    });
})

const editconschema = Joi.object().keys({
    conceptid: Joi.string().required(),
    koid: Joi.string().required(),
    conception: Joi.string().required(),
    conceptcode: Joi.string().required()
});

app.put('/editcon', async function(req, res) {
    try {
        await editconschema.validateAsync(req.body);
    } catch (e) {
        console.log("2");
        return res.status(400).send("<h1>400</h1><br><h4>올바른 값이 아닙니다.</h4>");
    }
    const options = {
        method: 'GET',
        url: 'https://solved.ac/api/v3/search/tag',
        qs: { query: req.body.conceptid },
        headers: { 'Content-Type': 'application/json' }
    };
    request(options, function(error, response, solvedac) {
        if (error) {
            console.log(error);
            return res.status(400).send("<h1>400</h1><br><h4>올바른 값이 아닙니다.</h4>");
        }
        solvedac = JSON.parse(solvedac);
        console.log(solvedac.count);
        if (solvedac.count == 0) {
            return res.status(400).send("<h1>400</h1><br><h4>그러한 개념은 없거나 비슷한 개념아이디가 존재합니다. 개념아이디를 다시 한번 확인하여 주시기 바랍니다. </h4>");
        }
        var find = 0;
        for (var i = 0; i < solvedac.items.length; i++) {
            console.log(solvedac.items[i].key);
            if (solvedac.items[i].key == req.body.conceptid) {
                console.log(3);
                db.collection("concept").updateOne({ _id: req.body.conceptid }, { $set: { koid: solvedac.items[0].displayNames[0].name, conception: req.body.conception, code: req.body.conceptcode } }, async function(err, result) {
                    if (err) {
                        return res.status(500).send("<h1>500</h1><br><h4>값을 업데이트 하지 못하였습니다. 서버 오류 발생</h4>");
                    } else {
                        console.log("업데이트 되었습니다");
                        await res.redirect('/allcon');
                    }
                })
                find = 1;
                break;
            }
        }
        if (find == 0) {
            return res.status(400).send("<h1>400</h1><br><h4>그러한 개념은 없거나 비슷한 개념아이디가 존재합니다. 개념아이디를 다시 한번 확인하여 주시기 바랍니다. </h4>");
        }
    });
})
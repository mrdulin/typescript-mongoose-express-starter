const router = require('express').Router();
const Actor = require(__base + 'models/movie/actor');
const Movie = require(__base + 'models/movie/movie');

router.route('/')
	/**
	 * 获取所有演员数据
	 */
	.get((req, res, next) => {
		Actor.find((err, actors) => {
			if (err) return res.status(400).json(err);
			res.status(200).json(actors);
		})
	})
	/**
	 *	创建一个演员数据
	 */
	.post((req, res, next) => {
		Actor.create(req.body, (err, actor) => {
			if (err) return res.status(400).json(err);
			res.status(201).json(actor);
		})
	})
/**
 * 根据id查找演员
 */

router.route('/:id')
	.get((req, res, next) => {
		Actor.findOne({ id: req.params.id }).populate('movies').exec((err, actor) => {
			if (err) return res.status(400).json(err);
			if (!actor) return res.status(404).json();
			res.status(200).json(actor);
		})
	})
	/**
	 * 	根据演员id，更新演员数据
	 */
	.put((req, res, next) => {
		Actor.findOneAndUpdate({ id: req.params.id }, req.body, (err, actor) => {
			if (err) return res.status(400).json(err);
			if (!actor) return res.status(404).json();
			res.status(200).json(actor);
		})
	})
	/**
	 * 	根据演员id，删除该演员
	 */
	.delete((req, res, next) => {
		Actor.findOneAndDelete({ id: req.params.id }, err => {
			if (err) return res.status(400).json(err);
			res.status(204).json();
		})
	})
/**
 *	给某个演员添加电影
 */
router.post('/:id/movies', (req, res, next) => {
	Actor.findOne({ id: req.params.id }, (err, actor) => {
		if (err) return res.status(400).json(err);
		if (!actor) return res.status(404).json();

		Movie.findOne({ id: req.body.id }, (err, movie) => {
			if (err) return res.status(400).json(err);
			if (!movie) return res.status(404).json();
			actor.movies.push(movie);
			actor.save(err => {
				if (err) return res.status(500).json(err);
				res.status(201).json(actor);
			})
		})
	})

})

router.delete('/:id/movies/:mid', (req, res, next) => {

})

module.exports = router;

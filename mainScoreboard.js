var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _ReactQuery = ReactQuery,
    QueryClient = _ReactQuery.QueryClient,
    QueryClientProvider = _ReactQuery.QueryClientProvider,
    useQuery = _ReactQuery.useQuery;
var _React = React,
    useState = _React.useState,
    useEffect = _React.useEffect,
    createRoot = _React.createRoot,
    useRef = _React.useRef;


var queryClient = new QueryClient();

var MainScoreboard = function MainScoreboard(props) {
	var days = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
	var date = new Date();

	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (day < 10) day = "0" + day;
	if (month < 10) month = "0" + month;

	var today = year + "-" + month + "-" + day;

	var _useState = useState(0),
	    _useState2 = _slicedToArray(_useState, 2),
	    dayClicks = _useState2[0],
	    setDayClicks = _useState2[1];

	var _useState3 = useState(days[date.getDay()]),
	    _useState4 = _slicedToArray(_useState3, 2),
	    dayName = _useState4[0],
	    setDayName = _useState4[1];

	var _useState5 = useState(day + "." + month + "." + year),
	    _useState6 = _slicedToArray(_useState5, 2),
	    displayDate = _useState6[0],
	    setDisplayDate = _useState6[1];

	var _useState7 = useState(year + "-" + month + "-" + day),
	    _useState8 = _slicedToArray(_useState7, 2),
	    APIDate = _useState8[0],
	    setAPIDate = _useState8[1];

	var prevDate = function prevDate() {
		setDayClicks(dayClicks - 1);
		setForeignRefetch(false);
		setCzechRefetch(false);
		setNoData(true);

		if (dayClicks >= 6) {
			setMaxDate(true);
		} else {
			setMaxDate(false);
		}

		date = new Date(new Date().setDate(new Date().getDate() + (dayClicks - 1)));
		year = date.getFullYear();
		month = date.getMonth() + 1;
		day = date.getDate();
		if (day < 10) day = "0" + day;
		if (month < 10) month = "0" + month;
		setDayName(days[date.getDay()]);
		setDisplayDate(day + "." + month + "." + year);
		setAPIDate(year + "-" + month + "-" + day);
	};
	var nextDate = function nextDate() {
		setDayClicks(dayClicks + 1);
		setForeignRefetch(false);
		setCzechRefetch(false);
		setNoData(true);

		if (dayClicks >= 6) {
			setMaxDate(true);
		} else {
			setMaxDate(false);
		}

		date = new Date(new Date().setDate(new Date().getDate() + (dayClicks + 1)));
		year = date.getFullYear();
		month = date.getMonth() + 1;
		day = date.getDate();
		if (day < 10) day = "0" + day;
		if (month < 10) month = "0" + month;
		setDayName(days[date.getDay()]);
		setDisplayDate(day + "." + month + "." + year);
		setAPIDate(year + "-" + month + "-" + day);
	};

	/* API FETCHING */

	var _useState9 = useState(false),
	    _useState10 = _slicedToArray(_useState9, 2),
	    czechRefetch = _useState10[0],
	    setCzechRefetch = _useState10[1];

	var _useState11 = useState(false),
	    _useState12 = _slicedToArray(_useState11, 2),
	    foreignRefetch = _useState12[0],
	    setForeignRefetch = _useState12[1];

	var _useState13 = useState(""),
	    _useState14 = _slicedToArray(_useState13, 2),
	    activeLeagueTab = _useState14[0],
	    setActiveLeagueTab = _useState14[1];

	var _useState15 = useState(null),
	    _useState16 = _slicedToArray(_useState15, 2),
	    buttonsUrl = _useState16[0],
	    setButtonsUrl = _useState16[1];

	var _useState17 = useState(true),
	    _useState18 = _slicedToArray(_useState17, 2),
	    noData = _useState18[0],
	    setNoData = _useState18[1];

	var _useState19 = useState(false),
	    _useState20 = _slicedToArray(_useState19, 2),
	    maxDate = _useState20[0],
	    setMaxDate = _useState20[1];

	var urlForeignRoot = "//s3-eu-west-1.amazonaws.com/hokej.cz/scoreboard/onlajny/";
	var urlCzechRoot = "//s3-eu-west-1.amazonaws.com/hokej.cz/scoreboard/";

	var foreignQuery = useQuery(["foreign"], function () {
		return fetch("" + urlForeignRoot + APIDate + ".json").then(function (res) {
			return res.json();
		});
	}, {
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: foreignRefetch,
		refetchIntervalInBackground: true,
		onSuccess: function onSuccess(res) {
			setForeignRefetch(5000);
		},
		onError: function onError(res) {
			return setForeignRefetch(false);
		},
		enabled: APIDate == today ? true : false
	});
	var czechQuery = useQuery(["czech"], function () {
		return fetch("" + urlCzechRoot + APIDate + ".json").then(function (res) {
			return res.json();
		});
	}, {
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: czechRefetch,
		refetchIntervalInBackground: true,
		onSuccess: function onSuccess(res) {
			setCzechRefetch(5000);
		},
		onError: function onError(res) {
			return setCzechRefetch(false);
		},
		enabled: APIDate == today ? true : false
	});
	var LeagueTabs = useRef(null);

	var _useState21 = useState({
		pointerEvents: true,
		isScrolling: false,
		left: 0,
		x: 0
	}),
	    _useState22 = _slicedToArray(_useState21, 2),
	    scroll = _useState22[0],
	    setScroll = _useState22[1];

	var mouseDownHandler = function mouseDownHandler(e) {
		LeagueTabs.current.style.cursor = "grabbing";
		LeagueTabs.current.style.userSelect = "none";
		setScroll({
			pointerEvents: true,
			isScrolling: true,
			left: LeagueTabs.current.scrollLeft,
			x: e.clientX
		});
	};
	var mouseMoveHandler = function mouseMoveHandler(e) {
		e.stopPropagation();
		if (scroll.isScrolling) {
			setScroll(Object.assign({}, scroll, { pointerEvents: false }));
			var dx = e.clientX - scroll.x;
			LeagueTabs.current.scrollLeft = scroll.left - dx;
		}
	};
	var mouseUpHandler = function mouseUpHandler(e) {
		LeagueTabs.current.style.cursor = "grab";
		LeagueTabs.current.style.removeProperty("user-select");
		setScroll(Object.assign({}, scroll, { isScrolling: false, pointerEvents: true }));
		e.stopPropagation();
	};

	useEffect(function () {
		czechQuery.refetch();
		foreignQuery.refetch();
	}, [APIDate]);

	useEffect(function () {
		var leagues = [];
		if (LeagueTabs.current) {
			LeagueTabs.current.childNodes.forEach(function (data) {
				leagues.push({
					id: data.getAttribute("id"),
					priority: data.getAttribute("data-order")
				});
			});
			leagues.sort(function (a, b) {
				return b.priority - a.priority;
			});
			if (leagues.length > 0) {
				setNoData(false);
				setActiveLeagueTab(leagues[0].id);
			}
		}
	}, [czechRefetch, foreignRefetch, czechQuery.isSuccess, foreignQuery.isSuccess]);

	useEffect(function () {
		Object.entries(scoreboardLeagues).map(function (value) {
			if (value[1].id == activeLeagueTab) {
				setButtonsUrl(value[1]);
			}
		});
	});
	return React.createElement(
		"section",
		{ className: "mainScoreboard" },
		foreignQuery.isFetching || czechQuery.isFetching == true ? React.createElement("div", { className: "loadContainer" }) : "",
		React.createElement(
			"header",
			{ className: "mainScoreboard-header" },
			React.createElement(
				"div",
				{ className: "header-date" },
				React.createElement(
					"div",
					{ className: "date-dayChanger prev", onClick: prevDate },
					React.createElement("img", { src: "../img/ArrowLeftGrey.svg", alt: "" }),
					React.createElement(
						"h5",
						null,
						"P\u0159edchoz\xED den"
					)
				),
				React.createElement(
					"h1",
					{ className: "date-currentDay" },
					dayName,
					" ",
					displayDate.replaceAll(".", ". ")
				),
				React.createElement(
					"div",
					{ className: "date-dayChanger next", onClick: nextDate },
					React.createElement(
						"h5",
						null,
						"N\xE1sleduj\xEDc\xED den"
					),
					React.createElement("img", { src: "../img/ArrowRightGrey.svg", alt: "" })
				)
			),
			(czechQuery.isSuccess || foreignQuery.isSuccess) && !maxDate ? React.createElement(
				"div",
				{
					onMouseDown: mouseDownHandler,
					onMouseMove: mouseMoveHandler,
					onMouseUp: mouseUpHandler,
					ref: LeagueTabs,
					className: "header-tabs"
				},
				czechQuery.data != undefined && Object.entries(czechQuery.data).map(function (_ref) {
					var _ref2 = _slicedToArray(_ref, 2),
					    key = _ref2[0],
					    value = _ref2[1];

					var isFake = value.matches.every(function (match) {
						return displayDate != match.date.replaceAll("-", ".");
					});
					var priority = void 0;
					var render = false;
					Object.entries(scoreboardLeagues).map(function (value) {
						if (value[1].id == key) {
							priority = value[1].priority;
							if (value[1].sourceOnlajny === false) {
								render = true;
							}
						}
					});
					if (!isFake && render) {
						return React.createElement(
							"div",
							{
								className: "tab-container " + (key == activeLeagueTab ? "active" : ""),
								id: key,
								onClick: function onClick() {
									setActiveLeagueTab(key);
								},
								key: key,
								"data-order": priority,
								style: { order: -priority, pointerEvents: scroll.pointerEvents ? "all" : "none" }
							},
							React.createElement(
								"p",
								null,
								value.league_name
							)
						);
					}
				}),
				foreignQuery.data != undefined && Object.entries(foreignQuery.data).map(function (_ref3) {
					var _ref4 = _slicedToArray(_ref3, 2),
					    key = _ref4[0],
					    value = _ref4[1];

					var isFake = value.matches.every(function (match) {
						return APIDate != match.date;
					});
					var render = false;
					var priority = void 0;
					Object.entries(scoreboardLeagues).map(function (value) {
						if (value[1].id == key) {
							priority = value[1].priority;
							if (value[1].sourceOnlajny === true) {
								render = true;
							}
						}
					});
					if (!isFake && render) {
						return React.createElement(
							"div",
							{
								className: "tab-container " + (key == activeLeagueTab ? "active" : ""),
								id: key,
								onClick: function onClick() {
									setActiveLeagueTab(key);
								},
								key: key,
								"data-order": priority,
								style: { order: -priority, pointerEvents: scroll.pointerEvents ? "all" : "none" }
							},
							React.createElement(
								"p",
								null,
								value.league_name
							)
						);
					}
				})
			) : React.createElement("div", null)
		),
		(czechQuery.isSuccess || foreignQuery.isSuccess) && !noData && !maxDate ? React.createElement(
			"div",
			{ className: "mainScoreBoard-body" },
			czechQuery.data != undefined && Object.entries(czechQuery.data).map(function (_ref5) {
				var _ref6 = _slicedToArray(_ref5, 2),
				    key = _ref6[0],
				    value = _ref6[1];

				if (key == activeLeagueTab) {
					return React.createElement(
						"div",
						{ key: key },
						value.matches.map(function (match) {
							var homeLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.home.onlajny_id;
							var visitorsLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.visitor.onlajny_id;
							return React.createElement(
								"a",
								{ href: "/zapas/" + match.hokejcz_id + "/", className: "body-match", key: match.hokejcz_id },
								React.createElement(
									"div",
									{ className: "match-infoContainer" },
									React.createElement(
										"div",
										{ className: "match-team match-team--left" },
										React.createElement(
											"h3",
											null,
											match.home.shortcut
										),
										React.createElement(
											"div",
											{ className: "match-team--img" },
											React.createElement("img", { src: homeLogo, alt: "" })
										)
									),
									React.createElement(
										"div",
										{ className: "match-scoreContainer" },
										React.createElement(
											"div",
											{
												className: "match-score " + (match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
											},
											match.score_home
										),
										match.match_status == "po zápase" && React.createElement(
											"div",
											{ className: "match-date" },
											React.createElement(
												"p",
												null,
												"Konec"
											),
											match.score_periods != undefined && React.createElement(
												"p",
												null,
												match.score_periods[0],
												", ",
												match.score_periods[1],
												", ",
												match.score_periods[2]
											),
											match.score_period != undefined && React.createElement(
												"p",
												null,
												match.score_period[0],
												", ",
												match.score_period[1],
												", ",
												match.score_period[2]
											)
										),
										match.match_status == "před zápasem" && React.createElement(
											"div",
											{ className: "match-date future-match" },
											React.createElement(
												"p",
												null,
												dayName
											),
											React.createElement(
												"p",
												null,
												match.date.replace(/-/gi, "."),
												" \u2022 ",
												match.time
											)
										),
										match.match_status == "live" && React.createElement(
											"div",
											{ className: "match-date active-match" },
											React.createElement(
												"p",
												null,
												match.match_actual_time_alias
											),
											match.score_periods != undefined && React.createElement(
												"p",
												null,
												match.score_periods[0],
												", ",
												match.score_periods[1],
												", ",
												match.score_periods[2]
											),
											match.score_period != undefined && React.createElement(
												"p",
												null,
												match.score_period[0],
												", ",
												match.score_period[1],
												", ",
												match.score_period[2]
											)
										),
										React.createElement(
											"div",
											{
												className: "match-score " + (match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
											},
											match.score_visitor
										)
									),
									React.createElement(
										"div",
										{ className: "match-team" },
										React.createElement(
											"div",
											{ className: "match-team--img" },
											React.createElement("img", { src: visitorsLogo, alt: "" })
										),
										React.createElement(
											"h3",
											null,
											match.visitor.shortcut
										)
									)
								),
								React.createElement(
									"div",
									{ className: "match-tabsContainer" },
									(value.league_name == "Tipsport extraliga" || value.league_name == "CHANCE LIGA") && (match.match_status == "před zápasem" || match.match_status == "live") && React.createElement(
										"div",
										{ className: "mediaTab-container" },
										match.stream_url == "ct" && React.createElement(
											"a",
											{ href: "https://sport.ceskatelevize.cz/#live", target: "_blank", className: "match-tab--imgOnly" },
											React.createElement("img", { src: "../img/logoCT@2x.png", alt: "" })
										),
										match.stream_url == "o2" && React.createElement(
											"a",
											{ href: "https://www.o2tv.cz/", target: "_blank", className: "match-tab--imgOnly" },
											React.createElement("img", { src: "../img/logoO2@2x.png", alt: "" })
										)
									),
									value.league_name == "Tipsport extraliga" && match.match_status == "před zápasem" && React.createElement(
										"a",
										{ href: "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/preview", className: "match-tab" },
										React.createElement("img", { src: "../img/icoTextGray.svg", alt: "" }),
										React.createElement(
											"p",
											null,
											"Preview"
										)
									),
									match.bets.tipsport.link != null && match.match_status == "před zápasem" && React.createElement(
										"a",
										{ href: match.bets.tipsport.link, target: "_blank", className: "match-tab" },
										React.createElement("img", { src: "../img/icoTipsport.svg", alt: "" }),
										React.createElement(
											"div",
											{ className: "tab-tipsportData" },
											React.createElement(
												"p",
												null,
												match.bets.tipsport.home_win
											),
											React.createElement(
												"p",
												null,
												match.bets.tipsport.draw
											),
											React.createElement(
												"p",
												null,
												match.bets.tipsport.away_win
											)
										)
									),
									match.bets.tipsport.link != null && match.match_status == "live" && React.createElement(
										"a",
										{ href: "https://www.tipsport.cz/live", target: "_blank", className: "match-tab" },
										React.createElement("img", { src: "../img/icoTipsport.svg", alt: "" }),
										React.createElement(
											"p",
											null,
											"Lives\xE1zka"
										)
									),
									(match.match_status == "live" || match.match_status == "před zápasem") && value.league_name == "CHANCE LIGA" && React.createElement(
										"div",
										null,
										match.stream_url == "ct" && React.createElement(
											"a",
											{ href: "https://sport.ceskatelevize.cz/#live", target: "_blank", className: "match-tab" },
											React.createElement("img", { src: "../img/icoPlay.svg", alt: "" }),
											React.createElement(
												"p",
												null,
												"\u017Div\u011B"
											)
										),
										match.stream_url == "o2" && React.createElement(
											"a",
											{ href: "https://www.o2tv.cz/", target: "_blank", className: "match-tab" },
											React.createElement("img", { src: "../img/icoPlay.svg", alt: "" }),
											React.createElement(
												"p",
												null,
												"\u017Div\u011B"
											)
										),
										match.stream_url == null && React.createElement(
											"a",
											{
												href: "https://www.hokej.cz/tv/hokejka/chl?matchId=" + match.hokejcz_id + "/",
												target: "_blank",
												className: "match-tab"
											},
											React.createElement("img", { src: "../img/icoPlay.svg", alt: "" }),
											React.createElement(
												"p",
												null,
												"\u017Div\u011B"
											)
										)
									),
									(match.match_status == "live" || match.match_status == "před zápasem") && value.league_name == "Tipsport extraliga" && React.createElement(
										"div",
										null,
										match.stream_url == "ct" && React.createElement(
											"a",
											{ href: "https://sport.ceskatelevize.cz/#live", target: "_blank", className: "match-tab" },
											React.createElement("img", { src: "../img/icoPlay.svg", alt: "" }),
											React.createElement(
												"p",
												null,
												"\u017Div\u011B"
											)
										),
										match.stream_url == "o2" && React.createElement(
											"a",
											{ href: "https://www.o2tv.cz/", target: "_blank", className: "match-tab" },
											React.createElement("img", { src: "../img/icoPlay.svg", alt: "" }),
											React.createElement(
												"p",
												null,
												"\u017Div\u011B"
											)
										),
										match.stream_url == null && React.createElement(
											"a",
											{
												href: "https://www.hokej.cz/tv/hokejka/elh?matchId=" + match.hokejcz_id + "/",
												target: "_blank",
												className: "match-tab"
											},
											React.createElement("img", { src: "../img/icoPlay.svg", alt: "" }),
											React.createElement(
												"p",
												null,
												"\u017Div\u011B"
											)
										)
									),
									match.match_status == "live" && React.createElement(
										"a",
										{ href: "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/on-line", target: "_blank", className: "match-tab" },
										React.createElement("img", { src: "../img/icoText.svg", alt: "" }),
										React.createElement(
											"p",
											null,
											"Text"
										)
									),
									match.match_status == "po zápase" && value.league_name == "Tipsport extraliga" && React.createElement(
										"a",
										{ href: "https://www.hokej.cz/tv/hokejka/category/14", target: "_blank", className: "match-tab" },
										React.createElement("img", { src: "../img/icoPlayBlack.svg", alt: "" }),
										React.createElement(
											"p",
											null,
											"Z\xE1znam"
										)
									),
									match.match_status == "po zápase" && value.league_name == "CHANCE LIGA" && React.createElement(
										"a",
										{ href: "https://www.hokej.cz/tv/hokejka/category/23", target: "_blank", className: "match-tab" },
										React.createElement("img", { src: "../img/icoPlayBlack.svg", alt: "" }),
										React.createElement(
											"p",
											null,
											"Z\xE1znam"
										)
									),
									match.match_status == "po zápase" && React.createElement(
										"a",
										{ href: "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/", className: "match-tab" },
										React.createElement("img", { src: "../img/icoSummary.svg", alt: "" }),
										React.createElement(
											"p",
											null,
											"Z\xE1pis"
										)
									)
								)
							);
						})
					);
				}
			}),
			foreignQuery.data != undefined && Object.entries(foreignQuery.data).map(function (_ref7) {
				var _ref8 = _slicedToArray(_ref7, 2),
				    key = _ref8[0],
				    value = _ref8[1];

				if (key == activeLeagueTab) {
					return React.createElement(
						"div",
						{ key: key },
						value.matches.map(function (match) {
							var homeLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.home.onlajny_id;
							var visitorsLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.visitor.onlajny_id;

							if (APIDate == match.date) {
								return React.createElement(
									"a",
									{ href: "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/", className: "body-match", key: match.hokejcz_id },
									React.createElement(
										"div",
										{ className: "match-infoContainer" },
										React.createElement(
											"div",
											{ className: "match-team match-team--left" },
											React.createElement(
												"h3",
												null,
												match.home.shortcut
											),
											React.createElement(
												"div",
												{ className: "match-team--img" },
												React.createElement("img", { src: homeLogo, alt: "" })
											)
										),
										React.createElement(
											"div",
											{ className: "match-scoreContainer" },
											React.createElement(
												"div",
												{
													className: "match-score " + (match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
												},
												match.score_home
											),
											match.match_status == "po zápase" && React.createElement(
												"div",
												{ className: "match-date" },
												React.createElement(
													"p",
													null,
													"Konec"
												),
												match.score_periods != undefined && React.createElement(
													"p",
													null,
													match.score_periods[0],
													", ",
													match.score_periods[1],
													", ",
													match.score_periods[2]
												),
												match.score_period != undefined && React.createElement(
													"p",
													null,
													match.score_period[0],
													", ",
													match.score_period[1],
													", ",
													match.score_period[2]
												)
											),
											match.match_status == "před zápasem" && React.createElement(
												"div",
												{ className: "match-date future-match" },
												React.createElement(
													"p",
													null,
													APIDate == match.date ? dayName : "Zítra ráno"
												),
												React.createElement(
													"p",
													null,
													match.date.replace(/-/gi, "."),
													" \u2022 ",
													match.time
												)
											),
											match.match_status == "live" && React.createElement(
												"div",
												{ className: "match-date active-match" },
												React.createElement(
													"p",
													null,
													match.match_actual_time_name
												),
												match.score_periods != undefined && React.createElement(
													"p",
													null,
													match.score_periods[0],
													", ",
													match.score_periods[1],
													", ",
													match.score_periods[2]
												),
												match.score_period != undefined && React.createElement(
													"p",
													null,
													match.score_period[0],
													", ",
													match.score_period[1],
													", ",
													match.score_period[2]
												)
											),
											React.createElement(
												"div",
												{
													className: "match-score " + (match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
												},
												match.score_visitor
											)
										),
										React.createElement(
											"div",
											{ className: "match-team" },
											React.createElement(
												"div",
												{ className: "match-team--img" },
												React.createElement("img", { src: visitorsLogo, alt: "" })
											),
											React.createElement(
												"h3",
												null,
												match.visitor.shortcut
											)
										)
									),
									React.createElement(
										"div",
										{ className: "match-tabsContainer" },
										match.bets.tipsport.link != null && match.match_status == "před zápasem" && React.createElement(
											"a",
											{ href: match.bets.tipsport.link, target: "_blank", className: "match-tab" },
											React.createElement("img", { src: "../img/icoTipsport.svg", alt: "" }),
											React.createElement(
												"div",
												{ className: "tab-tipsportData" },
												React.createElement(
													"p",
													null,
													match.bets.tipsport.home_win
												),
												React.createElement(
													"p",
													null,
													match.bets.tipsport.draw
												),
												React.createElement(
													"p",
													null,
													match.bets.tipsport.away_win
												)
											)
										),
										match.bets.tipsport.link != null && match.match_status == "live" && React.createElement(
											"a",
											{ href: "https://www.tipsport.cz/live", target: "_blank", className: "match-tab" },
											React.createElement("img", { src: "../img/icoTipsport.svg", alt: "" }),
											React.createElement(
												"p",
												null,
												"Lives\xE1zka"
											)
										),
										match.match_status == "live" && React.createElement(
											"a",
											{ href: "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/on-line", target: "_blank", className: "match-tab" },
											React.createElement("img", { src: "../img/icoText.svg", alt: "" }),
											React.createElement(
												"p",
												null,
												"Text"
											)
										),
										match.match_status == "po zápase" && React.createElement(
											"a",
											{ href: "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/", className: "match-tab" },
											React.createElement("img", { src: "../img/icoSummary.svg", alt: "" }),
											React.createElement(
												"p",
												null,
												"Z\xE1pis"
											)
										)
									)
								);
							}
						})
					);
				}
			})
		) : React.createElement(
			"div",
			{ className: "mainScoreBoard-body--noData" },
			React.createElement(
				"h1",
				null,
				"\u017D\xE1dn\xE9 z\xE1pasy k zobrazen\xED"
			)
		),
		(czechQuery.isSuccess || foreignQuery.isSuccess) && !noData && !maxDate && React.createElement(
			"div",
			{ className: "scoreBoard-buttonsContainer" },
			React.createElement(
				"a",
				{ href: buttonsUrl ? buttonsUrl.url.matches : "#", className: "scoreBoard-button" },
				"Rozpis z\xE1pas\u016F"
			),
			React.createElement(
				"a",
				{ href: buttonsUrl ? buttonsUrl.url.table : "#", className: "scoreBoard-button" },
				"Tabulka sout\u011B\u017Ee"
			)
		)
	);
};

var Render = function Render() {
	return React.createElement(
		QueryClientProvider,
		{ client: queryClient },
		React.createElement(MainScoreboard, null)
	);
};

var domContainer = document.querySelector("#main-scoreboard");
/* ReactDOM.createRoot(domContainer).render(<Render />) */
ReactDOM.render(React.createElement(Render), domContainer);
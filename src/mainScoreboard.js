const { QueryClient, QueryClientProvider, useQuery } = ReactQuery
const { useState, useEffect, createRoot, useRef } = React

const queryClient = new QueryClient()

const MainScoreboard = (props) => {
	const days = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"]
	let date = new Date()

	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()
	if (day < 10) day = "0" + day
	if (month < 10) month = "0" + month

	let today = year + "-" + month + "-" + day

	const [dayClicks, setDayClicks] = useState(0)
	const [dayName, setDayName] = useState(days[date.getDay()])
	const [displayDate, setDisplayDate] = useState(day + "." + month + "." + year)
	const [APIDate, setAPIDate] = useState(year + "-" + month + "-" + day)

	const prevDate = () => {
		setDayClicks(dayClicks - 1)
		setForeignRefetch(false)
		setCzechRefetch(false)

		date = new Date(new Date().setDate(new Date().getDate() + (dayClicks - 1)))
		year = date.getFullYear()
		month = date.getMonth() + 1
		day = date.getDate()
		if (day < 10) day = "0" + day
		if (month < 10) month = "0" + month
		setDayName(days[date.getDay()])
		setDisplayDate(day + "." + month + "." + year)
		setAPIDate(year + "-" + month + "-" + day)
	}
	const nextDate = () => {
		setDayClicks(dayClicks + 1)
		setForeignRefetch(false)
		setCzechRefetch(false)

		date = new Date(new Date().setDate(new Date().getDate() + (dayClicks + 1)))
		year = date.getFullYear()
		month = date.getMonth() + 1
		day = date.getDate()
		if (day < 10) day = "0" + day
		if (month < 10) month = "0" + month
		setDayName(days[date.getDay()])
		setDisplayDate(day + "." + month + "." + year)
		setAPIDate(year + "-" + month + "-" + day)
	}

	/* API FETCHING */
	const [czechRefetch, setCzechRefetch] = useState(false)
	const [foreignRefetch, setForeignRefetch] = useState(false)
	const [activeLeagueTab, setActiveLeagueTab] = useState("")
	const [buttonsUrl, setButtonsUrl] = useState(null)
	const [data, setData] = useState([])

	const urlForeignRoot = "//s3-eu-west-1.amazonaws.com/hokej.cz/scoreboard/onlajny/"
	const urlCzechRoot = "//s3-eu-west-1.amazonaws.com/hokej.cz/scoreboard/"

	const foreignQuery = useQuery(["foreign"], () => fetch(`${urlForeignRoot}${APIDate}.json`).then((res) => res.json()), {
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: foreignRefetch,
		refetchIntervalInBackground: true,
		onSuccess: (res) => {
			setForeignRefetch(5000)
		},
		onError: (res) => setForeignRefetch(false),
		enabled: APIDate == today ? true : false,
	})
	const czechQuery = useQuery(["czech"], () => fetch(`${urlCzechRoot}${APIDate}.json`).then((res) => res.json()), {
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: czechRefetch,
		refetchIntervalInBackground: true,
		onSuccess: (res) => {
			setCzechRefetch(5000)
		},
		onError: (res) => setCzechRefetch(false),
		enabled: APIDate == today ? true : false,
	})
	const LeagueTabs = useRef(null)
	useEffect(() => {
		czechQuery.refetch()
		foreignQuery.refetch()
	}, [APIDate])

	useEffect(() => {
		let leagues = []
		if (LeagueTabs.current) {
			LeagueTabs.current.childNodes.forEach((data) => {
				leagues.push({
					id: data.getAttribute("id"),
					priority: data.getAttribute("data-order"),
				})
			})
			leagues.sort((a, b) => {
				return b.priority - a.priority
			})
			setActiveLeagueTab(leagues[0].id)
		}
	}, [czechRefetch, foreignRefetch, czechQuery.isSuccess, foreignQuery.isSuccess])

	useEffect(() => {
		Object.entries(scoreboardLeagues).map((value) => {
			if (value[1].id == activeLeagueTab) {
				setButtonsUrl(value[1])
			}
		})
	})
	return (
		<section className="mainScoreboard">
			{foreignQuery.isLoading || czechQuery.isLoading == true ? (
				<div className="loadContainer">
					<h3>Loading...</h3>
				</div>
			) : (
				""
			)}
			<header className={"mainScoreboard-header"}>
				<div className="header-date">
					<div className="date-dayChanger" onClick={prevDate}>
						<img src="../img/ArrowLeftGrey.svg" alt="" />
						<h5>Předchozí den</h5>
					</div>
					<h1 className="date-currentDay">
						{dayName} {displayDate}
					</h1>
					<div className="date-dayChanger" onClick={nextDate}>
						<h5>Následující den</h5>
						<img src="../img/ArrowRightGrey.svg" alt="" />
					</div>
				</div>
				{czechQuery.isSuccess || foreignQuery.isSuccess ? (
					<div ref={LeagueTabs} className={"header-tabs"}>
						{czechQuery.data != undefined &&
							Object.entries(czechQuery.data).map(([key, value]) => {
								let priority
								Object.entries(scoreboardLeagues).map((value) => {
									if (value[1].id == key) {
										priority = value[1].priority
									}
								})
								return (
									<div
										className={"tab-container " + (key == activeLeagueTab ? "active" : "")}
										id={key}
										onClick={() => {
											setActiveLeagueTab(key)
										}}
										key={key}
										data-order={priority}
										style={{ order: -priority }}
									>
										<p>{value.league_name}</p>
									</div>
								)
							})}
						{foreignQuery.data != undefined &&
							Object.entries(foreignQuery.data).map(([key, value]) => {
								let isFake = value.matches.every((match) => {
									return APIDate != match.date
								})
								let priority
								Object.entries(scoreboardLeagues).map((value) => {
									if (value[1].id == key) {
										priority = value[1].priority
									}
								})
								if (!isFake) {
									return (
										<div
											className={"tab-container " + (key == activeLeagueTab ? "active" : "")}
											id={key}
											onClick={() => {
												setActiveLeagueTab(key)
											}}
											key={key}
											data-order={priority}
											style={{ order: -priority }}
										>
											<p>{value.league_name}</p>
										</div>
									)
								}
							})}
					</div>
				) : (
					<div></div>
				)}
			</header>
			{czechQuery.isSuccess || foreignQuery.isSuccess ? (
				<div className="mainScoreBoard-body">
					{czechQuery.data != undefined &&
						Object.entries(czechQuery.data).map(([key, value]) => {
							if (key == activeLeagueTab) {
								return (
									<div key={key}>
										{value.matches.map((match) => {
											let homeLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.home.onlajny_id}`
											let visitorsLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.visitor.onlajny_id}`
											return (
												<a href={`/zapas/${match.hokejcz_id}/`} className="body-match" key={match.hokejcz_id}>
													<div className="match-infoContainer">
														<div className="match-team match-team--left">
															<h3>{match.home.short_name != "" ? match.home.short_name : match.home.name}</h3>
															<h3 className="small-name">{match.home.shortcut}</h3>
															<img src={homeLogo} alt="" />
														</div>
														<div className="match-scoreContainer">
															<div
																className={
																	"match-score " +
																	(match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
																}
															>
																{match.score_home}
															</div>
															{match.match_status == "po zápase" && (
																<div className="match-date">
																	<p>Konec</p>
																	{match.score_periods != undefined && (
																		<p>
																			{match.score_periods[0]}, {match.score_periods[1]}, {match.score_periods[2]}
																		</p>
																	)}
																	{match.score_period != undefined && (
																		<p>
																			{match.score_period[0]}, {match.score_period[1]}, {match.score_period[2]}
																		</p>
																	)}
																</div>
															)}
															{match.match_status == "před zápasem" && (
																<div className="match-date future-match">
																	<p>{dayName}</p>
																	<p>
																		{match.date.replace(/-/gi, ".")} • {match.time}
																	</p>
																</div>
															)}
															{match.match_status == "live" && (
																<div className="match-date active-match">
																	<p>{match.match_actual_time_alias}</p>

																	{match.score_periods != undefined && (
																		<p>
																			{match.score_periods[0]}, {match.score_periods[1]}, {match.score_periods[2]}
																		</p>
																	)}
																	{match.score_period != undefined && (
																		<p>
																			{match.score_period[0]}, {match.score_period[1]}, {match.score_period[2]}
																		</p>
																	)}
																</div>
															)}

															<div
																className={
																	"match-score " +
																	(match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
																}
															>
																{match.score_visitor}
															</div>
														</div>
														<div className="match-team">
															<img src={visitorsLogo} alt="" />
															<h3>{match.visitor.short_name != "" ? match.visitor.short_name : match.visitor.name}</h3>
															<h3 className="small-name">{match.visitor.shortcut}</h3>
														</div>
													</div>

													<div className="match-tabsContainer">
														{value.league_name == "Tipsport extraliga" && match.match_status == "před zápasem" && (
															<a href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/preview`} className="match-tab">
																<img src="../img/icoTextGray.svg" alt="" />
																<p>Preview</p>
															</a>
														)}
														{match.bets.tipsport.link != null && match.match_status == "před zápasem" && (
															<a href={match.bets.tipsport.link} target="_blank" className="match-tab">
																<img src="../img/icoTipsport.svg" alt="" />
																<div className="tab-tipsportData">
																	<p>{match.bets.tipsport.home_win}</p>
																	<p>{match.bets.tipsport.draw}</p>
																	<p>{match.bets.tipsport.away_win}</p>
																</div>
															</a>
														)}
														{value.league_name == "Tipsport extraliga" &&
															(match.match_status == "před zápasem" || match.match_status == "live") && (
																<div className="mediaTab-container">
																	<a href="#" target="_blank" className="match-tab--imgOnly">
																		<img src="../img/logoCT@2x.png" alt="" />
																	</a>
																	<a href="#" target="_blank" className="match-tab--imgOnly">
																		<img src="../img/logoO2@2x.png" alt="" />
																	</a>
																</div>
															)}
														{match.bets.tipsport.link != null && match.match_status == "live" && (
															<a href={match.bets.tipsport.link} target="_blank" className="match-tab">
																<img src="../img/icoTipsport.svg" alt="" />
																<p>Livesázka</p>
															</a>
														)}
														{match.match_status == "live" && value.league_name == "CHANCE LIGA" && (
															<a href={`https://www.hokej.cz/tv/hokejka/chl?matchId=${match.hokejcz_id}/`} target="_blank" className="match-tab">
																<img src="../img/icoPlay.svg" alt="" />
																<p>Živě</p>
															</a>
														)}
														{match.match_status == "live" && value.league_name == "Tipsport extraliga" && (
															<a href={`https://www.hokej.cz/tv/hokejka/elh?matchId=${match.hokejcz_id}/`} target="_blank" className="match-tab">
																<img src="../img/icoPlay.svg" alt="" />
																<p>Živě</p>
															</a>
														)}
														{match.match_status == "live" && (
															<a href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/on-line`} target="_blank" className="match-tab">
																<img src="../img/icoText.svg" alt="" />
																<p>Text</p>
															</a>
														)}
														{match.match_status == "po zápase" && value.league_name == "Tipsport extraliga" && (
															<a href="https://www.hokej.cz/tv/hokejka/category/14" target="_blank" className="match-tab">
																<img src="../img/icoPlayBlack.svg" alt="" />
																<p>Záznam</p>
															</a>
														)}
														{match.match_status == "po zápase" && value.league_name == "CHANCE LIGA" && (
															<a href="https://www.hokej.cz/tv/hokejka/category/23" target="_blank" className="match-tab">
																<img src="../img/icoPlayBlack.svg" alt="" />
																<p>Záznam</p>
															</a>
														)}
														{match.match_status == "po zápase" && (
															<a href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/`} className="match-tab">
																<img src="../img/icoSummary.svg" alt="" />
																<p>Zápis</p>
															</a>
														)}
													</div>
												</a>
											)
										})}
									</div>
								)
							}
						})}
					{foreignQuery.data != undefined &&
						Object.entries(foreignQuery.data).map(([key, value]) => {
							if (key == activeLeagueTab) {
								return (
									<div key={key}>
										{value.matches.map((match) => {
											let homeLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.home.onlajny_id}`
											let visitorsLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.visitor.onlajny_id}`

											if (APIDate == match.date) {
												return (
													<a href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/`} className="body-match" key={match.hokejcz_id}>
														<div className="match-infoContainer">
															<div className="match-team match-team--left">
																<h3>{match.home.short_name != "" ? match.home.short_name : match.home.name}</h3>
																<h3 className="small-name">{match.home.shortcut}</h3>
																<img src={homeLogo} alt="" />
															</div>
															<div className="match-scoreContainer">
																<div
																	className={
																		"match-score " +
																		(match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
																	}
																>
																	{match.score_home}
																</div>
																{match.match_status == "po zápase" && (
																	<div className="match-date">
																		<p>Konec</p>

																		{match.score_periods != undefined && (
																			<p>
																				{match.score_periods[0]}, {match.score_periods[1]}, {match.score_periods[2]}
																			</p>
																		)}
																		{match.score_period != undefined && (
																			<p>
																				{match.score_period[0]}, {match.score_period[1]}, {match.score_period[2]}
																			</p>
																		)}
																	</div>
																)}
																{match.match_status == "před zápasem" && (
																	<div className="match-date future-match">
																		<p>{APIDate == match.date ? dayName : "Zítra ráno"}</p>
																		<p>
																			{match.date.replace(/-/gi, ".")} • {match.time}
																		</p>
																	</div>
																)}
																{match.match_status == "live" && (
																	<div className="match-date active-match">
																		<p>{match.match_actual_time_name}</p>
																		{match.score_periods != undefined && (
																			<p>
																				{match.score_periods[0]}, {match.score_periods[1]}, {match.score_periods[2]}
																			</p>
																		)}
																		{match.score_period != undefined && (
																			<p>
																				{match.score_period[0]}, {match.score_period[1]}, {match.score_period[2]}
																			</p>
																		)}
																	</div>
																)}

																<div
																	className={
																		"match-score " +
																		(match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
																	}
																>
																	{match.score_visitor}
																</div>
															</div>
															<div className="match-team">
																<img src={visitorsLogo} alt="" />
																<h3>{match.visitor.short_name != "" ? match.visitor.short_name : match.visitor.name}</h3>
																<h3 className="small-name">{match.visitor.shortcut}</h3>
															</div>
														</div>

														<div className="match-tabsContainer">
															{match.bets.tipsport.link != null && match.match_status == "před zápasem" && (
																<a href={match.bets.tipsport.link} target="_blank" className="match-tab">
																	<img src="../img/icoTipsport.svg" alt="" />
																	<div className="tab-tipsportData">
																		<p>{match.bets.tipsport.home_win}</p>
																		<p>{match.bets.tipsport.draw}</p>
																		<p>{match.bets.tipsport.away_win}</p>
																	</div>
																</a>
															)}
															{match.bets.tipsport.link != null && match.match_status == "live" && (
																<a href={match.bets.tipsport.link} target="_blank" className="match-tab">
																	<img src="../img/icoTipsport.svg" alt="" />
																	<p>Livesázka</p>
																</a>
															)}
															{match.match_status == "live" && (
																<a href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/on-line`} target="_blank" className="match-tab">
																	<img src="../img/icoText.svg" alt="" />
																	<p>Text</p>
																</a>
															)}
															{match.match_status == "po zápase" && (
																<a href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/`} className="match-tab">
																	<img src="../img/icoSummary.svg" alt="" />
																	<p>Zápis</p>
																</a>
															)}
														</div>
													</a>
												)
											}
										})}
									</div>
								)
							}
						})}
				</div>
			) : (
				<div className="mainScoreBoard-body--noData">
					<h1>Žádné zápasy k zobrazení</h1>
				</div>
			)}
			<div className="scoreBoard-buttonsContainer">
				<a href={buttonsUrl ? buttonsUrl.url.matches : "#"} className="scoreBoard-button">
					Rozpis zápasů
				</a>
				<a href={buttonsUrl ? buttonsUrl.url.table : "#"} className="scoreBoard-button">
					Tabulka soutěže
				</a>
			</div>
		</section>
	)
}

const Render = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<MainScoreboard />
		</QueryClientProvider>
	)
}

const domContainer = document.querySelector("#main-scoreboard")
/* ReactDOM.createRoot(domContainer).render(<Render />) */
ReactDOM.render(React.createElement(Render), domContainer)

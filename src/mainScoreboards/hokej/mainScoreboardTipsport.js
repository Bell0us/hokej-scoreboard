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
		setCzechRefetch(false)

		if (dayClicks >= 6) {
			setMaxDate(true)
		} else {
			setMaxDate(false)
		}

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
		setCzechRefetch(false)

		if (dayClicks >= 6) {
			setMaxDate(true)
		} else {
			setMaxDate(false)
		}

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
	const [maxDate, setMaxDate] = useState(false)
	const [data, setData] = useState(null)

	const urlCzechRoot = "//s3-eu-west-1.amazonaws.com/hokej.cz/scoreboard/"

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

	useEffect(() => {
		czechQuery.refetch()
	}, [APIDate])

	useEffect(() => {
		if (czechQuery.data) {
			setData(Object.entries(czechQuery.data).find((el) => el[0] == 101))
		}
	}, [czechQuery.isSuccess, czechRefetch])

	return (
		<section className="mainScoreboard">
			{czechQuery.isFetching == true ? <div className="loadContainer"></div> : ""}
			<header className={"mainScoreboard-header"}>
				<div className="header-date">
					<div className="date-dayChanger prev" onClick={prevDate}>
						<img src="../img/ArrowLeftGrey.svg" alt="" />
						<h5>Předchozí den</h5>
					</div>
					<h1 className="date-currentDay">
						{dayName} {displayDate.replaceAll(".", ". ")}
					</h1>
					<div className="date-dayChanger next" onClick={nextDate}>
						<h5>Následující den</h5>
						<img src="../img/ArrowRightGrey.svg" alt="" />
					</div>
				</div>
			</header>
			{data != null && !maxDate ? (
				<div className="mainScoreBoard-body">
					{data[1].matches.map((match) => {
						let homeLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.home.onlajny_id}`
						let visitorsLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.visitor.onlajny_id}`
						return (
							<a href={`/zapas/${match.hokejcz_id}/`} className="body-match" key={match.hokejcz_id}>
								<div className="match-infoContainer">
									<div className="match-team match-team--left">
										<h3 className="shortName">{match.home.short_name ? match.home.short_name : match.home.shortcut}</h3>
										<h3>{match.home.shortcut}</h3>
										<div className="match-team--img">
											<img src={homeLogo} alt="" />
										</div>
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
												<p>
													{match.match_actual_time_alias == "0"
														? "1"
														: match.match_actual_time_alias == "10"
														? "1"
														: match.match_actual_time_alias == "20"
														? "2"
														: match.match_actual_time_alias == "30"
														? "3"
														: match.match_actual_time_alias}
													. tř.
												</p>
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
										<div className="match-team--img">
											<img src={visitorsLogo} alt="" />
										</div>
										<h3 className="shortName">{match.visitor.short_name ? match.visitor.short_name : match.visitor.shortcut}</h3>
										<h3>{match.visitor.shortcut}</h3>
									</div>
								</div>
								<div className="match-tabsContainer">
									{(data[1].league_name == "Tipsport extraliga" || data[1].league_name == "CHANCE LIGA") &&
										(match.match_status == "před zápasem" || match.match_status == "live") && (
											<div className="mediaTab-container">
												{match.stream_url == "ct" && (
													<a href="https://sport.ceskatelevize.cz/#live" target="_blank" className="match-tab--imgOnly">
														<img src="../img/logoCT@2x.png" alt="" />
													</a>
												)}
												{match.stream_url == "o2" && (
													<a href="https://www.o2tv.cz/" target="_blank" className="match-tab--imgOnly">
														<img src="../img/logoO2@2x.png" alt="" />
													</a>
												)}
											</div>
										)}
									{(match.match_status == "live" || match.match_status == "před zápasem") && data[1].league_name == "CHANCE LIGA" && (
										<div>
											{match.stream_url == "ct" && (
												<a href="https://sport.ceskatelevize.cz/#live" target="_blank" className="match-tab">
													<img src="../img/icoPlay.svg" alt="" />
													<p>Živě</p>
												</a>
											)}
											{match.stream_url == "o2" && (
												<a href="https://www.o2tv.cz/" target="_blank" className="match-tab">
													<img src="../img/icoPlay.svg" alt="" />
													<p>Živě</p>
												</a>
											)}
											{match.stream_url == null && (
												<a href={`https://www.hokej.cz/tv/hokejka/chl?matchId=${match.hokejcz_id}/`} target="_blank" className="match-tab">
													<img src="../img/icoPlay.svg" alt="" />
													<p>Živě</p>
												</a>
											)}
										</div>
									)}
									{(match.match_status == "live" || match.match_status == "před zápasem") && data[1].league_name == "Tipsport extraliga" && (
										<div>
											{match.stream_url == "ct" && (
												<a href="https://sport.ceskatelevize.cz/#live" target="_blank" className="match-tab">
													<img src="../img/icoPlay.svg" alt="" />
													<p>Živě</p>
												</a>
											)}
											{match.stream_url == "o2" && (
												<a href="https://www.o2tv.cz/" target="_blank" className="match-tab">
													<img src="../img/icoPlay.svg" alt="" />
													<p>Živě</p>
												</a>
											)}
											{match.stream_url == null && (
												<a href={`https://www.hokej.cz/tv/hokejka/elh?matchId=${match.hokejcz_id}/`} target="_blank" className="match-tab">
													<img src="../img/icoPlay.svg" alt="" />
													<p>Živě</p>
												</a>
											)}
										</div>
									)}
									{match.match_status == "live" && (
										<a href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/on-line`} target="_blank" className="match-tab">
											<img src="../img/icoText.svg" alt="" />
											<p>Text</p>
										</a>
									)}
									{data[1].league_name == "Tipsport extraliga" && match.match_status == "před zápasem" && (
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
									{match.bets.tipsport.link != null && match.match_status == "live" && (
										<a href="https://www.tipsport.cz/live" target="_blank" className="match-tab">
											<img src="../img/icoTipsport.svg" alt="" />
											<p>Livesázka</p>
										</a>
									)}
									{match.match_status == "po zápase" && data[1].league_name == "Tipsport extraliga" && (
										<a href="https://www.hokej.cz/tv/hokejka/category/14" target="_blank" className="match-tab">
											<img src="../img/icoPlayBlack.svg" alt="" />
											<p>Záznam</p>
										</a>
									)}
									{match.match_status == "po zápase" && data[1].league_name == "CHANCE LIGA" && (
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
			) : (
				<div className="mainScoreBoard-body--noData">
					<h1>Žádné zápasy k zobrazení</h1>
				</div>
			)}
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

const domContainer = document.querySelector("#main-scoreboard-tipsport")
/* ReactDOM.createRoot(domContainer).render(<Render />) */
ReactDOM.render(React.createElement(Render), domContainer)

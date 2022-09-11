const { QueryClient, QueryClientProvider, useQuery } = ReactQuery
const { useState } = React

const queryClient = new QueryClient()

const TopScoreboard = (props) => {
	let date = new Date()

	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()
	if (day < 10) day = "0" + day
	if (month < 10) month = "0" + month

	const [APIDate, setAPIDate] = useState(year + "-" + month + "-" + day)
	const [czechRefetch, setCzechRefetch] = useState(false)
	const [foreignRefetch, setForeignRefetch] = useState(false)

	/* API FETCHING */
	const urlForeignRoot = "//s3-eu-west-1.amazonaws.com/hokej.cz/scoreboard/onlajny/"
	const urlCzechRoot = "//s3-eu-west-1.amazonaws.com/hokej.cz/scoreboard/"

	const foreignQuery = useQuery("foreign", () => fetch(`${urlForeignRoot}${APIDate}.json`).then((res) => res.json()), {
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: foreignRefetch,
		refetchIntervalInBackground: true,
		onSuccess: (res) => setForeignRefetch(5000),
		onError: (res) => setForeignRefetch(false),
	})
	const czechQuery = useQuery("czech", () => fetch(`${urlCzechRoot}${APIDate}.json`).then((res) => res.json()), {
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: czechRefetch,
		refetchIntervalInBackground: true,
		onSuccess: (res) => setCzechRefetch(5000),
		onError: (res) => setCzechRefetch(false),
	})
	/* END API FETCHING */
	return (
		<div className="topScoreboard-container">
			{foreignQuery.isSuccess || czechQuery.isSuccess ? (
				<section className="topScoreboard">
					{czechQuery.data != undefined &&
						Object.entries(czechQuery.data).map(([key, value]) => {
							let render = false
							let priority
							Object.entries(scoreboardLeagues).map((value) => {
								if (value[1].id == key) {
									priority = value[1].priority
									if (value[1].sourceOnlajny === false) {
										render = true
									}
								}
							})
							if (render) {
								return (
									<section className="League" key={key} style={{ order: -priority }}>
										<div className={"league-name" + (value.league_name.length > 14 ? " set-width" : "")}>
											<h3>{value.league_name}</h3>
											<img src="../img/ArrowRightBlack.svg" alt="" />
										</div>
										{value.matches.map((match) => {
											let homeLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.home.onlajny_id}`
											let visitorsLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.visitor.onlajny_id}`
											return (
												<a href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/`} className="league-match" key={match.hokejcz_id}>
													<div className="league-team">
														<div className="team-container">
															<img src={homeLogo} alt="" />
															<p className="team-name">{match.home.shortcut}</p>
														</div>
														<div
															className={
																"team-score " +
																(match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
															}
														>
															{match.score_home}
														</div>
													</div>
													<div className="league-team">
														<div className="team-container">
															<img src={visitorsLogo} alt="" />
															<p className="team-name">{match.visitor.shortcut}</p>
														</div>
														<div
															className={
																"team-score " +
																(match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
															}
														>
															{match.score_visitor}
														</div>
													</div>
												</a>
											)
										})}
									</section>
								)
							}
						})}
					{foreignQuery.data != undefined &&
						Object.entries(foreignQuery.data).map(([key, value]) => {
							let render = false
							let priority
							Object.entries(scoreboardLeagues).map((value) => {
								if (value[1].id == key) {
									priority = value[1].priority
									if (value[1].sourceOnlajny === true) {
										render = true
									}
								}
							})
							if (
								value.matches.some(function (match) {
									return match.date == APIDate
								}) &&
								render
							) {
								return (
									<section className="League" key={key} style={{ order: -priority }}>
										<div className={"league-name" + (value.league_name.length > 10 ? " set-width" : "")}>
											<h3>{value.league_name}</h3>
											<img src="../img/ArrowRightBlack.svg" alt="" />
										</div>
										{value.matches.map((match) => {
											let homeLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.home.onlajny_id}`
											let visitorsLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.visitor.onlajny_id}`
											if (APIDate == match.date) {
												return (
													<a href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/`} className="league-match" key={match.hokejcz_id}>
														<div className="league-team">
															<div className="team-container">
																<img src={homeLogo} alt="" />
																<p className="team-name">{match.home.shortcut}</p>
															</div>
															<div
																className={
																	"team-score " +
																	(match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
																}
															>
																{match.score_home}
															</div>
														</div>
														<div className="league-team">
															<div className="team-container">
																<img src={visitorsLogo} alt="" />
																<p className="team-name">{match.visitor.shortcut}</p>
															</div>
															<div
																className={
																	"team-score " +
																	(match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
																}
															>
																{match.score_visitor}
															</div>
														</div>
													</a>
												)
											}
										})}
									</section>
								)
							}
						})}
				</section>
			) : (
				""
			)}
		</div>
	)
}

const Render = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<TopScoreboard />
		</QueryClientProvider>
	)
}

const domContainer = document.querySelector("#top-scoreboard")
ReactDOM.render(React.createElement(Render), domContainer)
/* ReactDOM.createRoot(domContainer).render(<Render />) */

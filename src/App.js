import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectsShowCase from './components/ProjectsShowCase'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class App extends Component {
  state = {
    // eslint-disable-next-line react/no-unused-state
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
    selectOption: 'ALL',
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {selectOption} = this.state

    const url = `https://apis.ccbp.in/ps/projects?category=${selectOption}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.projects.map(c => ({
        id: c.id,
        name: c.name,
        imageUrl: c.image_url,
      }))
      this.setState({
        // eslint-disable-next-line react/no-unused-state
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" height={50} width={70} color="#00BFFF" />
    </div>
  )

  onChangeOption = event => {
    this.setState({selectOption: event.target.value}, this.getData)
  }

  successView = () => {
    const {projectsList} = this.state

    return (
      <div className="projects-container">
        <ul className="list-container">
          {projectsList.map(each => (
            <ProjectsShowCase key={each.id} projectDetails={each} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="button" type="button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  renderProjectsShow = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.successView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {selectOption} = this.state

    return (
      <div className="app-container">
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo-image"
          />
        </nav>
        <div className="container">
          <ul className="select-container">
            <select
              className="option-container"
              value={selectOption}
              onChange={this.onChangeOption}
            >
              {categoriesList.map(each => (
                <option value={each.id} key={each.id}>
                  {each.displayText}
                </option>
              ))}
            </select>
          </ul>
          {this.renderProjectsShow()}
        </div>
      </div>
    )
  }
}

export default App

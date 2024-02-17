import './index.css'

const ProjectsShowCase = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails

  return (
    <li className="list-item">
      <img src={imageUrl} alt={name} className="image" />
      <p className="para">{name}</p>
    </li>
  )
}

export default ProjectsShowCase

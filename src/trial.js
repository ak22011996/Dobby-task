import React, { Component } from 'react'
import { get } from 'axios'
import { connect } from 'react-redux'
import { FadeIn } from 'animate-components'
import {
  getSearchResults,
  setSearchedOnce,
  setPageNum,
  setFormValues,
} from '../../actions/searchresults'
import SearchResult from './Result/searchResult'
import SearchNoResult from './Result/searchNoResult'

class SearchAdvanced extends Component {
  constructor(props) {
    super(props)
    this.state = { searchedOnce: false, users: [] }
  }

  handleChange(event) {
    event.preventDefault()
    this.props.setFormValues(this.props.formValues)
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.setSearchedOnce(true)
    const apiSearchURL = `/api/search/religion/${this.props.formValues.religion}/gender/${this.props.formValues.gender}`
    get(apiSearchURL, { maxContentLength: 400 })
    .then((searchResults) => {
      this.props.getSearchResults(searchResults)
    })
  }

  loadMoreClick() {
    this.props.setPageNum(this.props.pageNo + 1)
  }

  render() {
    const { users } = this.props
    let mapPageNo = this.props.pageNo
    let map_usersList = users.data && users.data.slice(0, mapPageNo * 2).map((userlist => (
      <SearchResult key={userlist.id} {...userlist} />
    )))
    let mapSearchedOnce = this.props.searchedOnce
    return (
      <div>
      <FadeIn duration="300ms">
        <div className="mid_rig_inner">
          <div className="mid_inner">
            <ul>
            { mapSearchedOnce
              ?  map_usersList
              :  <SearchNoResult/>
            }
            {
              mapSearchedOnce ?
              (mapPageNo * 2 >= 3)
              ?
              <div className="text-center my3 text-danger">
                No more profiles. Try to modify search criteria.
              </div> :
              <div className="text-center my3">
              <button type="button" className="btn btn-primary" onClick={this.loadMoreClick.bind(this)}>
                   Load More
                </button>
              </div>
              : ''
            }
            </ul>
          </div>
          <div className="rig_inner">
          <div className="my-4">
            <div className="recomm">
              <div className="recomm_top">
                <span>Search</span>
              </div>
            </div>
            <div className="search_advan_box">
              <form onSubmit={this.handleSubmit.bind(this)}>
                <select
                  name="religion"
                  className="mb-2"
                  value={this.props.formValues.religion}
                  onChange={this.handleChange.bind(this)}
                >
                  <option value="" disabled="">
                    Select Religion
                  </option>
                  <option value="Any">Any Religion</option>
                  <option>Christian</option>
                  <option>Hindu</option>
                  <option>Muslim</option>
                  <option>Jain</option>
                  <option>Buddhist</option>
                  <option>Sikh</option>
                  <option>Parsi</option>
                  <option>Jewish</option>
                  <option>Spiritual</option>
                  <option>No Religion</option>
                  <option>Other</option>
                </select>

                <select
                  name="gender"
                  className="mb-2"
                  value={this.props.formValues.gender}
                  onChange={this.handleChange.bind(this)}
                >
                  <option value="" disabled="">
                    Select Gender
                  </option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <input
                  type="submit"
                  className="my-4 btn btn-primary p2"
                  value={mapSearchedOnce ? "Refine Results":"Search Profiles"}
                />
              </form>
            </div>
          </div>

          </div>
        </div>
        </FadeIn>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  users: state.Result.users,
  searchedOnce: state.Result.searchedOnce,
  pageNo: state.Result.pageNo,
  formValues: state.Result.formValues
})
const mapDispatchToProps = {
    getSearchResults,
    setSearchedOnce,
    setPageNum,
    setFormValues
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchAdvanced)
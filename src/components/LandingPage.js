import React,  { Component } from 'react';
import { connect } from "react-redux";
import MDSpinner from "react-md-spinner";
import backgroundImage from '../graphics/background.svg';
import styles from "./LandingPage.css";
import { fetchClientConfigurations, fetchDashboardJSONs } from '../actions';
import packageJson from '../../package.json';

class LandingPage extends Component {
  state = {
    showUserDropdown: false
  }
  componentDidMount() {
    if (!this.props.landingPage.fetchClientConfigs) {
      this.props.fetchClientConfigurations();
    };
  }
  componentDidUpdate(prevProps) {
    const { landingPage } = this.props;
    if (
      landingPage.fetchClientConfigs === "RECEIVED" &&
      prevProps.landingPage.fetchClientConfigs !== "RECEIVED"
    ) {
      this.props.fetchDashboardJSONs(landingPage.clientConfigurations);
    };
  }

  getImageUrl = (url) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      return url;
    } else {
      return "/dashboard/" + url;
    };
  }

  openOrCloseUserDropdown = (bol) => {
    if (bol) {
      this.setState({
        showUserDropdown: true
      });
    } else {
      this.setState({
        showUserDropdown: false
      });
    };
  }

  render () {
    const {
      landingPage,
      bootstrap
    } = this.props;

    const {
      first_name,
      authenticated,
      login,
      logout
    } = bootstrap;

    const {
      fetchClientConfigs,
      fetchDashboardJSONs,
      dashboardJSONs
    } = landingPage;
    
    return (
      <div className={styles.LandingPage}>
        <div className={styles.LandingPageBackground}>
          <img src={backgroundImage} alt="background" className={styles.LandingPageBackgroundImage} />
        </div>
        <header>
          <div className={styles.UserDropdown}>
            {authenticated === true ? (
              !this.state.showUserDropdown ? (
                <div
                  className={styles.UserDropdownClosed}
                  onClick={() => this.openOrCloseUserDropdown(true)}
                >
                  <i className="fa fa-caret-down" />
                  &nbsp;&nbsp;
                  <i className="fa fa-user" />
                  &nbsp;&nbsp;
                  {first_name}
                </div>
              ) : (
                <div
                  className={styles.UserDropdownOpen}
                  onClick={() => this.openOrCloseUserDropdown(false)}
                >
                  <i className="fa fa-caret-up" />
                  &nbsp;&nbsp;
                  <i className="fa fa-user" />
                  &nbsp;&nbsp;
                  {first_name}
                  <div
                    className={styles.UserDropdownContent}
                  >
                    <a href="https://sso.lizard.net/edit_profile/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa fa-pencil" />
                      &nbsp;&nbsp;Edit&nbsp;Profile
                    </a>
                    <a href={logout}>
                      <i className="fa fa-power-off" />
                      &nbsp;&nbsp;Logout
                    </a>
                  </div>
                </div>
              )
            ) : (
              this.state.fetchSlugs === "RECEIVED" && this.state.fetchJSONS === "RECEIVED" ? (
                <a href={login}>Login</a>
              ) : null
            )}
          </div>
          <h1 title={"client-version: " +packageJson.version} className={styles.LandingPageTitle}>Dashboards</h1>
        </header>
        <div className={styles.LandingPageBody}>
          <div className={styles.DashboardList}>
            {dashboardJSONs.map((dashboard, i)=>{
              return (
                <a 
                  className={styles.Dashboard}
                  key={i}
                  href={`/dashboards/${dashboard.slug.client_slug}`}
                >
                  <div className={styles.DashboardLogo}>
                    {dashboard.logo ? <img src={this.getImageUrl(dashboard.logo)} alt="logo" /> : null}
                  </div>
                  <div className={styles.DashboardInfo}>
                    <h2>{dashboard.title || ""}&nbsp;{dashboard.isPublic !== true && authenticated !== true ? ( <i title="login required" className="fa fa-lock" />): ""}</h2>
                    <p>{dashboard.description || ""}</p>
                    <div  className={styles.DashboardMetaTags}>
                      <div>{dashboard.tags || ""}</div>
                      <span>{dashboard.metadata || ""}</span>
                    </div>
                  </div>
                  <div  className={styles.CompanyLogo}>
                    {dashboard.logoCompanies ? <img src={this.getImageUrl(dashboard.logoCompanies)} alt="logo" /> : null}
                  </div>
                </a>
              )
            })}
            <div 
              className={styles.Spinner}
              style={
                fetchClientConfigs === "RECEIVED" && fetchDashboardJSONs === "RECEIVED" ? {
                  visibility: "hidden"
                } : {}
              }
            >
              <MDSpinner 
                size={164}
                singleColor={"#115E67"}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    landingPage: state.landingPage,
    bootstrap: state.session.bootstrap,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchClientConfigurations: () => dispatch(fetchClientConfigurations()),
    fetchDashboardJSONs: () => dispatch(fetchDashboardJSONs())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
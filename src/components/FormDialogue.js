import React from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { addUser, editUser, getUsers } from '../actions/users';
import Confirm from './Confirm';
import MulitpleSelect from './MulitpleSelect';

const roleOptions = ['Admin', 'Librarian', 'Member'];

function FormDialog(props) {
  const {
    show,
    close,
    token,
    onGetUsers,
    onShowSnackbar,
    title,
    user,
    onEditUser,
    onAddUser,
  } = props;
  const [open, setOpen] = React.useState(show);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [id, setId] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [name, setName] = React.useState('');
  const [roles, setRoles] = React.useState([]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleRoleChange = (selectedRoles) => {
    setRoles(selectedRoles);
  };

  const resetInput = () => {
    setEmail('');
    setBio('');
    setName('');
    setPassword('');
    setUsername('');
    setId('');
    setRoles([]);
  };

  const handleClose = () => {
    setOpen(false);
    close();
    setOpenConfirm(false);
    resetInput();
  };

  const onAdd = (event) => {
    event.preventDefault();
    if (!email || !username || !password) {
      onShowSnackbar(true, 'error', 'Please fill in the required fileds!');
      return;
    }
    onAddUser(email, username, password, roles, name, bio, token).then((response) => {
      if (response.status !== 201) {
        onShowSnackbar(true, 'error', `${response.message}`);
      }
      if (response.status === 201) {
        onShowSnackbar(true, 'success', `User ${response.data.username} was created`);
        onGetUsers(token);
        close();
      }
    });
  };

  const onEdit = (event) => {
    event.preventDefault();
    onEditUser(id, email, roles, name, bio, token).then((response) => {
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        onShowSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        onShowSnackbar(true, 'success', `User ${response.data.username} was edited`);
        onGetUsers(token);
        close();
      }
    });
  };

  const showConfirm = () => {
    if (username.length || password.length || email.length || name.length) {
      setOpenConfirm(true);
    } else {
      handleClose();
    }
  };

  React.useEffect(() => {
    setOpen(show);
    if (user) {
      setEmail(user.email);
      setBio(user.bio);
      setName(user.name);
      setPassword(user.password);
      setUsername(user.username);
      // eslint-disable-next-line no-underscore-dangle
      setId(user._id);
      // eslint-disable-next-line
      if (Object.values(user.roles).includes('Admin', 'Librarian')) {
        setRoles(Object.values(user.roles));
      }
    }
  }, [show, user]);

  return (
    <Dialog open={open} onClose={showConfirm} aria-labelledby="form-dialog-title">
      <Confirm
        show={openConfirm}
        title="Are you sure?"
        message="Entered input will be lost. Are you sure you want to cancel?"
        confirm={handleClose}
        cancel={() => setOpenConfirm(false)}
      />
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>Please fill in the following information.</DialogContentText>

        <TextField
          autoFocus
          margin="dense"
          id="username"
          label="Username*"
          defaultValue={username}
          disabled={user}
          type="username"
          fullWidth
          onChange={handleUsernameChange}
        />

        <TextField
          focus="true"
          margin="dense"
          id="email"
          defaultValue={email}
          label="Email Address*"
          type="email"
          fullWidth
          onChange={handleEmailChange}
        />
        <TextField
          margin="dense"
          id="password"
          label="Password*"
          type="password"
          disabled={user}
          defaultValue={password}
          fullWidth
          onChange={handlePasswordChange}
        />
        <MulitpleSelect
          onChange={handleRoleChange}
          selected={roles}
          options={roleOptions}
          label="Roles"
        />
        <TextField
          margin="dense"
          id="name"
          label="Name"
          type="name"
          defaultValue={name}
          fullWidth
          onChange={handleNameChange}
        />
        <TextField
          margin="dense"
          id="bio"
          label="Bio"
          type="bio"
          defaultValue={bio}
          fullWidth
          onChange={handleBioChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={showConfirm} color="primary">
          Cancel
        </Button>
        <Button onClick={user ? onEdit : onAdd} color="primary">
          {user ? 'Save' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

FormDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  onGetUsers: PropTypes.func.isRequired,
  onShowSnackbar: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  user: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.array])),
  onEditUser: PropTypes.func.isRequired,
  onAddUser: PropTypes.func.isRequired,
};

FormDialog.defaultProps = {
  user: null,
};

const mapStateToProps = (state) => ({
  token: state.token,
});

const mapDispatchToProps = (dispatch) => ({
  onEditUser: (id, email, roles, name, bio, token) =>
    dispatch(editUser(id, email, roles, name, bio, token)),
  onGetUsers: (token) => dispatch(getUsers(token)),
  onAddUser: (email, username, password, roles, name, bio, token) =>
    dispatch(addUser(email, username, password, roles, name, bio, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);

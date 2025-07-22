import useTheme from '../context/theme';

export default function ThemeBtn() {
    
    const {themeMode, lightTheme, darkTheme} = useTheme()
    const onChangeBtn = (e) => {
        const darkModeStatus = e.currentTarget.checked
        if (darkModeStatus) {
            darkTheme()
        } else {
            lightTheme()
        }
    }
    return (
        <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      onChange={onChangeBtn}
      checked={themeMode === "dark"}
    />
    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:bg-gray-700"></div>
    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
      {themeMode === 'dark' ? 'Dark' : 'Light'} Mode
    </span>
  </label>
    );
}